import './SelectedJob.css'
import { collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';

function SelectedJob({ selectedJob, setSelectedJob }) {

    const [onHold, setOnHold] = useState<boolean>(false);

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
                    <Button variant="success">Complete</Button>
                    <Button variant="secondary">Edit</Button>
                    <Button variant="danger" onClick={() => handleDeleteJob(selectedJob?.reference)}>Delete</Button>
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
            <Button variant="primary">Add Comment</Button>
        </div>
    )
}

export default SelectedJob