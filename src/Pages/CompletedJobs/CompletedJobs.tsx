import { collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import CompletedJobCard, { CompletedJobCardProps } from '../../Components/CompletedJobCard/CompletedJobCard';
import { db } from '../../Config/firebaseConfig';
import './Completedjobs.css'
import Accordion from 'react-bootstrap/Accordion';

function CompletedJobs() {

    document.title = 'Just Works | Completed Jobs';

    const [value, loading, error] = useCollection(
        collection(db, 'completed-jobs'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    return (
        <div className='completed-wrapper'>
            <h1>Completed Jobs:</h1>
            <Accordion defaultActiveKey="0">
            <div className='completed-container'>
                {error && <strong>Error: {JSON.stringify(error)}</strong>}
                {loading && <span>Loading Jobs...</span>}
                {value && (
                    value.docs.length === 0 ? <p>No jobs to display</p>
                        :
                        <>
                            {value.docs.map((doc) => (
                                <CompletedJobCard key={doc.id} job={doc.data() as CompletedJobCardProps['job']} />
                            ))}
                        </>
                )}
            </div>
            </Accordion>
        </div>
    )
}

export default CompletedJobs