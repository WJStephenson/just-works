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
                        <div className="job-card-header">
                            <Card.Title>{job.name}</Card.Title>
                            {job.onHold === true && <div className='onhold-icon'>Hold</div>}
                        </div>
                        <Card.Text>{job.description}</Card.Text>
                        <Button variant="primary" onClick={() => handleClick(job)}>View</Button>
                    </Card.Body>
                </Card>
            }
        </>
    );
}

export default JobCard;

