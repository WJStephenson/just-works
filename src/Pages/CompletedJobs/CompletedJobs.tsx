import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import CompletedJobCard from '../../Components/CompletedJobCard/CompletedJobCard';
import { db } from '../../Config/firebaseConfig';
import './Completedjobs.css'

function CompletedJobs() {

    const [value, loading, error] = useCollection(
        collection(db, 'completed-jobs'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    return (
        <div className='completed-wrapper'>
            <h1>Completed Jobs:</h1>
            <div className='completed-container'>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Loading Jobs...</span>}
                {value && (
                    value.docs.length === 0 ? <p>No jobs to display</p>
                        :
                        <>
                            {value.docs.map((doc) => (
                                <CompletedJobCard key={doc.id} job={doc.data()} />
                            ))}
                        </>
                )}
            </div>
        </div>
    )
}

export default CompletedJobs