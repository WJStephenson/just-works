import './SelectedJob.css'
import { collection, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import Button from 'react-bootstrap/Button';
import { useEffect, useState, useContext } from 'react';
import Comment from '../Comment/Comment';
import Form from 'react-bootstrap/Form';
import { useCollection } from 'react-firebase-hooks/firestore';
import ModalContext from '../../Context/ModalContext';
import CompleteJobModal from '../CompleteJobModal/CompleteJobModal';
import DeleteJobModal from '../DeleteJobModal/DeleteJobModal';
import EditJobModal from '../EditJobModal/EditJobModal';
import { Job } from '../../Pages/Homepage/Homepage';

interface SelectedJobProps {
    selectedJob: Job | null;
    setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
    identifier: string;
}

function SelectedJob({ selectedJob, setSelectedJob, identifier }: SelectedJobProps) {

    const [validate, setValidate] = useState<boolean>(false);

    const [formData, setFormData] = useState({
        comment: '',
        datetime: new Date().toISOString(),
        user: auth.currentUser?.displayName
    });

    const { setShowCompleteModal, setShowDeleteModal, setShowEditJobModal } = useContext(ModalContext);

    const [value, loading, error] = useCollection(
        collection(db, `live-jobs/${identifier}/comments`),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [onHold, setOnHold] = useState<boolean>(false);

    useEffect(() => {
        selectedJob && setOnHold(selectedJob.onHold);
    }, [selectedJob]);

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

    const handleFormChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (e.currentTarget.checkValidity() === false) {
            setValidate(true);
            return;
        }
        setValidate(false);

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
        setFormData({
            ...formData,
            comment: ''
        });
    }

    return (
        <div className='selectedjob-container'>
            <div className='buttons-container'>
                {
                    onHold === true ?
                        selectedJob &&
                        <Button variant="warning" onClick={() => handleHoldJob(selectedJob.reference)}>Unhold</Button>
                        :
                        selectedJob &&
                        <Button variant="warning" onClick={() => handleHoldJob(selectedJob.reference)}>Hold</Button>
                }
                <div className='buttons-right'>
                    <Button variant="success" onClick={() => setShowCompleteModal(true)}>Complete</Button>
                    <Button variant="secondary" onClick={() => setShowEditJobModal(true)}>Edit</Button>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>Delete</Button>
                </div>
            </div>
            <div>
                <div className='priority-ref'>
                    <p className='capitalize'>Priority: {selectedJob?.priority}</p>
                    {
                        selectedJob?.isRecurring &&
                        <p className='capitalize'>Frequency: {selectedJob.recurrenceFrequency}</p>
                    }
                    <p>Ref: {selectedJob?.reference}</p>
                </div>
                <h1>{selectedJob?.name}</h1>
                <h2>{selectedJob?.area}</h2>
                <h5>{selectedJob?.description}</h5>
                <p>Start: {selectedJob?.date}</p>
                <p>Completion: {selectedJob?.timeframe}</p>
                <p>Contractor: {selectedJob?.contractor}</p>
                <p>Reported By: {selectedJob?.reported_by}</p>
            </div>

            <div className='comments-container'>
                <h2>Comments:</h2>
                <Form onSubmit={handleFormSubmit} noValidate validated={validate}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Add a comment</Form.Label>
                        <Form.Control type="text" placeholder="Comment..." name='comment' value={formData.comment} onChange={handleFormChange()} required />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Add Comment
                    </Button>
                </Form>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Loading Comments...</span>}
                {value && (
                    <>
                        {value.docs
                            .map((doc) => ({
                                id: doc.id,
                                comment: doc.data().comment,
                                user: doc.data().user,
                                datetime: doc.data().datetime,
                            }))
                            .sort((a, b) => {
                                // Sort in ascending order (oldest to newest)
                                return new Date(a.datetime).getTime() - new Date(b.datetime).getTime();
                            })
                            .map((comment) => (
                                <Comment
                                    key={comment.id}
                                    commentObject={{
                                        comment: comment.comment,
                                        user: comment.user,
                                        datetime: comment.datetime,
                                    }}
                                />
                            ))
                        }
                    </>
                )}
            </div>
            <div className='modals'>
                <CompleteJobModal selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
                <DeleteJobModal selectedJob={selectedJob} setSelectedJob={setSelectedJob} />
                <EditJobModal selectedJob={selectedJob} setSelectedJob={setSelectedJob} identifier={identifier} />
            </div>
        </div>
    )
}

export default SelectedJob;
