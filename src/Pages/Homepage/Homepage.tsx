import { useEffect, useState } from 'react';
import './Homepage.css'
import { collection } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import JobCard from '../../Components/JobCard/JobCard';
import AddJobModal from '../../Components/AddJobModal/AddJobModal';
import SelectedJob from '../../Components/SelectedJob/SelectedJob';
// import Search from '../../Components/Search/Search';

function Homepage() {

    document.title = 'Just Works | Homepage';

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
    const [identifier, setIdentifier] = useState('');

    const [value, loading, error] = useCollection(
        collection(db, 'live-jobs'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

   

    return (
        <div className='homepage-container'>
            <div className='jobcard-container'>
                <h1>Live Jobs:</h1>
                <div className='jobcard-wrapper'>
                    {error && <strong>Error: {JSON.stringify(error)}</strong>}
                    {loading && <span>Loading Jobs...</span>}
                    {value && (
                        value.docs.length === 0 ? <p>No jobs to display</p> 
                        :
                        <>
                            {value.docs.map((doc) => (
                                <JobCard key={doc.id} job={doc.data()} setSelectedJob={setSelectedJob} setIdentifier={setIdentifier} identifier={doc.id}/>
                            ))}
                        </>
                    )}
                </div>
            </div>
            <div className='selectedjob-container'>
                <h1>Selected Job:</h1>
                {selectedJob?.length === 0 ? <p>No job selected</p> : <SelectedJob selectedJob={selectedJob} setSelectedJob={setSelectedJob} identifier={identifier}/>}
            </div>
            <AddJobModal />
        </div>
    );
}

export default Homepage;

