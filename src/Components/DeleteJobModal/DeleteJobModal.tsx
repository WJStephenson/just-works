import { collection, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { Modal } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import ModalContext from '../../Context/ModalContext';
import { useContext } from 'react';

function DeleteJobModal({ selectedJob, setSelectedJob }) {

    console.log(selectedJob);

    const { showDeleteModal, setShowDeleteModal } = useContext(ModalContext);

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
            setSelectedJob('');
        } catch (error) {
            console.error('Error querying documents: ', error);
        }
    };

    return (
        <div
            className="modal show"
            style={{ display: 'block', position: 'initial' }}
        >
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Complete Job</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <h2>{selectedJob.name}</h2>
                    <p>Are you sure you want to complete this job? </p>
                    <p><strong>Once complete it cannot be reopened.</strong></p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="primary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={() =>handleDeleteJob(selectedJob?.reference)}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default DeleteJobModal