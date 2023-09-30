import './JobCard.css';
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore"; // Import from regular Firebase Firestore
import { db } from '../../Config/firebaseConfig';

function JobCard({ liveJobs, fetchData }) {
    const handleDeleteJob = async (id) => {
        console.log(id);
        const jobs = collection(db, 'live-jobs');
        const q = query(jobs, where('id', '==', id)); // Create a query with Firestore
        console.log(q);

        try {
            const querySnapshot = await getDocs(q);

            querySnapshot.forEach(async (document) => {
                try {
                    await deleteDoc(doc(db, 'live-jobs', document.id)); // Use deleteDoc directly with Firestore
                    console.log('Document successfully deleted!');
                } catch (error) {
                    console.error('Error deleting document: ', error);
                }
            });
            fetchData();
        } catch (error) {
            console.error('Error querying documents: ', error);
        }
    };

    return (
        <div>
            <ul>
                {liveJobs?.map((job) => (
                    <div key={job.id}>
                        <h2>{job.area}</h2>
                        <ul>
                            <li>Contractor: {job.contractor}</li>
                            <li>Date: {job.date}</li>
                            <li>Description: {job.description}</li>
                            <li>Reported By: {job.reported_by}</li>
                            <li>Timeframe: {job.timeframe}</li>
                        </ul>
                        <button onClick={() => handleDeleteJob(job.id)}>Delete Job</button>
                    </div>
                ))}
            </ul>
        </div>
    );
}

export default JobCard;
