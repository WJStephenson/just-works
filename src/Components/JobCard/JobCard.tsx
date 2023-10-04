import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function JobCard({ liveJobs, setSelectedJob }) {

    // const handleDeleteJob = async (reference) => {
    //     console.log(reference);
    //     const jobs = collection(db, 'live-jobs');
    //     const q = query(jobs, where('reference', '==', reference));

    //     try {
    //         const querySnapshot = await getDocs(q);

    //         querySnapshot.forEach(async (document) => {
    //             try {
    //                 await deleteDoc(doc(db, 'live-jobs', document.id));
    //                 console.log('Document successfully deleted!');
    //             } catch (error) {
    //                 console.error('Error deleting document: ', error);
    //             }
    //         });
    //         fetchData();
    //     } catch (error) {
    //         console.error('Error querying documents: ', error);
    //     }
    // };

    return (
        <>
            {
                liveJobs.length === 0 ?
                    <p>No jobs to display</p>
                    :
                    liveJobs.map((job) => (
                        <Card key={job.reference} className="job-card">
                            <Card.Body>
                                <Card.Title>{job.area}</Card.Title>
                                <Card.Text>{job.description}</Card.Text>
                                <Button variant="primary" onClick={() => setSelectedJob(job)}>View</Button>
                            </Card.Body>
                        </Card>
                    ))
            }
        </>
    );
}

export default JobCard;

