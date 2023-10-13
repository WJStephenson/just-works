import './SelectedJob.css'
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import Button from 'react-bootstrap/Button';
import { useEffect, useState, useContext } from 'react';
import Comment from '../Comment/Comment';
import Form from 'react-bootstrap/Form';
import { useCollection } from 'react-firebase-hooks/firestore';
import ModalContext from '../../Context/ModalContext';
import CompleteJobModal from '../CompleteJobModal/CompleteJobModal';
import DeleteJobModal from '../DeleteJobModal/DeleteJobModal';

function SelectedJob({ selectedJob, setSelectedJob, identifier }) {

    const [formData, setFormData] = useState({
        comment: '',
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        user: auth.currentUser?.displayName
    });

    const { setShowCompleteModal, setShowDeleteModal } = useContext(ModalContext);

    const [value, loading, error] = useCollection(
        collection(db, `live-jobs/${identifier}/comments`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [onHold, setOnHold] = useState<boolean>(false);


    useEffect(() => {
        setOnHold(selectedJob?.onHold);
    }, [selectedJob])



    const handleHoldJob = async (reference: string) => {
        console.log(reference);
        const jobs = collection(db, 'live-jobs');
        const q = query(jobs, where('reference', '==', reference));

        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                try {
                    const docRef = doc(db, 'live-jobs', document.id);
                    const currentOnHold = document.data().onHold || false; // Ensure it's boolean
                    const updatedOnHold = !currentOnHold; // Toggle the value

                    // Update the 'onHold' field in Firestore
                    await updateDoc(docRef, { onHold: updatedOnHold });

                    // Update the local state 'onHold' to match the updated value
                    setOnHold(updatedOnHold);

                    console.log('Document successfully edited!');
                } catch (error) {
                    console.error('Error editing doc', error);
                }
            });
        } catch (error) {
            console.error('Error querying documents: ', error);
        }
    };

    const handleFormChange = () => (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const sendData = async () => {
            try {
                const jobs = collection(db, 'live-jobs');
                const q = query(jobs, where('reference', '==', selectedJob?.reference));

                const querySnapshot = await getDocs(q);

                querySnapshot.forEach(async (document) => {
                    try {
                        const docRef = doc(db, 'live-jobs', document.id);
                        const commentsCollectionRef = collection(docRef, 'comments');
                        const commentRef = doc(commentsCollectionRef);

                        await setDoc(commentRef, formData);
                        console.log('Document successfully written!');
                    } catch (error) {
                        console.error('Error writing document: ', error);
                    }
                });
            } catch (error) {
                console.error('Error querying documents: ', error);
            }
        };
        sendData();
    }


    return (
        <div className='selectedjob-container'>
            <div className='buttons-container'>
                {
                    onHold === true ?
                        <Button variant="warning" onClick={() => handleHoldJob(selectedJob?.reference)}>Unhold</Button>
                        :
                        <Button variant="warning" onClick={() => handleHoldJob(selectedJob?.reference)}>Hold</Button>
                }
                <div className='buttons-right'>
                    <Button variant="success" onClick={() => setShowCompleteModal(true)}>Complete</Button>
                    <Button variant="secondary">Edit</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete</Button>
                </div>
            </div>
            <div>
                <div className='priority-ref'>
                    <p>Priority: {selectedJob?.priority}</p>
                    <p>Ref: {selectedJob?.reference}</p>
                </div>
                <h1>{selectedJob?.name}</h1>
                <h2>{selectedJob?.area}</h2>
                <p>Raised: {selectedJob?.date}, {selectedJob?.time}</p>
                <p>Completion By: {selectedJob?.timeframe}</p>
                <p>{selectedJob?.contractor}</p>
                <h3>{selectedJob?.description}</h3>
                <p>Reported By: {selectedJob?.reported_by}</p>
            </div>

            <h2>Comments:</h2>

            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Add a comment</Form.Label>
                    <Form.Control type="text" placeholder="Comment..." name='comment' onChange={handleFormChange()} />
                </Form.Group>
                <Button variant="primary" type="submit" onClick={handleFormSubmit}>
                    Add Comment
                </Button>
            </Form>
            <div className='comments-container'>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Loading Comments...</span>}
                {value && (
                    <>
                        {value.docs.map((doc) => (
                            <>
                                <Comment key={doc.id} commentObject={doc.data()} />
                            </>
                        ))}
                    </>
                )}
            </div>
            <CompleteJobModal selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
            <DeleteJobModal selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
        </div>
    )
}

export default SelectedJob