import { useState } from 'react';
import './Homepage.css'
import { DocumentData, QuerySnapshot, collection, getFirestore } from 'firebase/firestore';
import { app } from '../../Config/firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import JobCard from '../../Components/JobCard/JobCard';
import AddJobModal from '../../Components/AddJobModal/AddJobModal';
import SelectedJob from '../../Components/SelectedJob/SelectedJob';
// import Search from '../../Components/Search/Search';

function Homepage() {

    interface Job {
        name: string;
        area: string;
        contractor: string;
        date: string;
        description: string;
        reported_by: string;
        timeframe: string;
        priority: string;
        reference: string;
        onHold: boolean;
    }

    const [selectedJob, setSelectedJob] = useState('');

    const [value, loading, error] = useCollection(
        collection(getFirestore(app), 'live-jobs'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );


    return (
        <div className='homepage-container'>
            <div className='jocard-container'>
                <h1>Live Jobs:</h1>
                <div className='jobcard-wrapper'>
                    {error && <strong>Error: {JSON.stringify(error)}</strong>}
                    {loading && <span>Loading Jobs...</span>}
                    {value && (
                        value.docs.length === 0 ? <p>No jobs to display</p> 
                        :
                        <>
                            {value.docs.map((doc) => (
                                <JobCard key={doc.id} job={doc.data()} setSelectedJob={setSelectedJob} />
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className='selectedjob-container'>
                <h1>Selected Job:</h1>
                {selectedJob?.length === 0 ? <p>No job selected</p> : <SelectedJob selectedJob={selectedJob} setSelectedJob={setSelectedJob} />}
            </div>
            <AddJobModal />
        </div>
    );
}

export default Homepage;

