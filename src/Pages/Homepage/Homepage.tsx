import { useState } from 'react';
import './Homepage.css'
import { collection } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { useCollection } from 'react-firebase-hooks/firestore';
import JobCard from '../../Components/JobCard/JobCard';
import AddJobModal from '../../Components/AddJobModal/AddJobModal';
import SelectedJob from '../../Components/SelectedJob/SelectedJob';

export type Job = {
    name: string,
    area: string,
    date: string,
    time: string,
    timeframe: string,
    contractor: string,
    description: string,
    reported_by: string,
    reference: string,
    priority: string,
    onHold: boolean,
    isRecurring: boolean,
    recurrenceFrequency: string,
    added: string,
} | null | undefined;

function Homepage() {

    document.title = 'Just Works | Homepage';

    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [identifier, setIdentifier] = useState<string>('');

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
                        value.docs.length === 0 ?

                            <p>No jobs to display</p>

                            :

                            <>
                                {
                                    value.docs.map((doc) => (
                                        <JobCard
                                            key={doc.id}
                                            job={{
                                                name: doc.data().name,
                                                area: doc.data().area,
                                                date: doc.data().date,
                                                time: doc.data().time,
                                                timeframe: doc.data().timeframe,
                                                contractor: doc.data().contractor,
                                                description: doc.data().description,
                                                reported_by: doc.data().reported_by,
                                                reference: doc.data().reference,
                                                priority: doc.data().priority,
                                                onHold: doc.data().onHold,
                                                isRecurring: doc.data().isRecurring,
                                                recurrenceFrequency: doc.data().recurrenceFrequency,
                                                added: doc.data().added,
                                            }}
                                            setSelectedJob={setSelectedJob}
                                            setIdentifier={setIdentifier}
                                            identifier={doc.id}
                                        />
                                    ))
                                }
                            </>
                    )}
                </div>
            </div>
            <div className='selectedjob-container'>
                <h1>Selected Job:</h1>
                {selectedJob === null ? <p>No job selected</p> : <SelectedJob selectedJob={selectedJob} setSelectedJob={setSelectedJob} identifier={identifier} />}

            </div>
            <AddJobModal />
        </div>
    );
}

export default Homepage;

