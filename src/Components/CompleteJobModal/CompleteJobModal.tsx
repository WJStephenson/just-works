import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ModalContext from '../../Context/ModalContext';
import { useContext } from 'react';
import { addDoc, collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { Job } from '../../Pages/Homepage/Homepage';

type CompleteJobModalProps = {
    selectedJob: Job;
    setSelectedJob: React.Dispatch<React.SetStateAction<Job>>;
}

function CompleteJobModal({ selectedJob, setSelectedJob }: CompleteJobModalProps) {

    const { showCompleteModal, setShowCompleteModal } = useContext(ModalContext);

    const handleCompleteJob = async () => {
        await addDoc(collection(db, "completed-jobs"), selectedJob)
        setShowCompleteModal(false);
        setSelectedJob(null);
        if (selectedJob?.reference){
            handleDeleteJob(selectedJob.reference);
        }
    }

    const handleDeleteJob = async (reference: string) => {
        console.log(reference);
        const jobs = collection(db, 'live-jobs');
        const q = query(jobs, where('reference', '==', reference));

        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                try {
                    await deleteDoc(doc(db, 'live-jobs', document.id));
                    console.log('Document successfully deleted!');
                } catch (error) {
                    console.error('Error deleting document: ', error);
                }
            });
            setSelectedJob(null);
        } catch (error) {
            console.error('Error querying documents: ', error);
        }
    };


    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={showCompleteModal} onHide={() => setShowCompleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Complete Job</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h2>{selectedJob?.name}</h2>
                    <p>Are you sure you want to complete this job? </p>
                    <p><strong>Once complete it cannot be reopened.</strong></p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowCompleteModal(false)}>Close</Button>
                    <Button variant="success" onClick={handleCompleteJob}>Complete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default CompleteJobModal