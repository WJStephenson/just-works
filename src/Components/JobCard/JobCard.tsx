import './JobCard.css'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';

function JobCard({ job, setSelectedJob, identifier, setIdentifier }) {

    const handleClick = (job) => {
        setSelectedJob(job);
        setIdentifier(identifier);
    }

    return (

        <>
            {
                <Card key={job.reference} className="job-card">
                    <Card.Body>
                        <Card.Title>{job.name}</Card.Title>
                        <Card.Text>{job.description}</Card.Text>
                        <Button variant="primary" onClick={() => handleClick(job)}>View</Button>
                    </Card.Body>
                    <Card.Footer className='card-notifications'>
                        {
                            job.priority === 'Low' && 
                            <div className='priority-icon low-priority'>{job.priority}</div>
                        }
                        {
                            job.priority === 'Medium' &&
                            <div className='priority-icon medium-priority'>{job.priority}</div>
                        }
                        {
                            job.priority === 'High' &&
                            <div className='priority-icon high-priority'>{job.priority}</div>
                        }
                        {
                            job.priority === 'Urgent' &&
                            <div className='priority-icon urgent-priority'>{job.priority}</div>
                        }
                        {job.onHold === true && <div className='onhold-icon'>On Hold</div>}
                    </Card.Footer>
                </Card>
            }
        </>
    );
}

export default JobCard;

