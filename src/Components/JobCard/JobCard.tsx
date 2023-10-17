import { Accordion } from 'react-bootstrap';
import './JobCard.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Job } from '../../Pages/Homepage/Homepage'

type JobCardProps = {
    job: Job,
    setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>,
    identifier: string,
    setIdentifier: React.Dispatch<React.SetStateAction<string>>,
}

function JobCard({ job, setSelectedJob, identifier, setIdentifier } : JobCardProps) {

    const handleClick = () => {
        setSelectedJob(job);
        setIdentifier(identifier);
    }

    return (
        <Accordion defaultActiveKey="1">
            <Accordion.Item eventKey="0" key={job?.reference}>
                <Accordion.Header className='accordion-header'>
                    {job?.name}
                    <div className='accordion-icons'>
                        {job?.onHold === true && <div className='onhold-icon'>On Hold</div>}
                        {job?.isRecurring === true && <div className='rec-icon'>Recurring</div>}
                        {
                            job?.priority === 'Low' &&
                            <div className='priority-icon low-priority'>{job.priority}</div>
                        }
                        {
                            job?.priority === 'Medium' &&
                            <div className='priority-icon medium-priority'>{job.priority}</div>
                        }
                        {
                            job?.priority === 'High' &&
                            <div className='priority-icon high-priority'>{job.priority}</div>
                        }
                        {
                            job?.priority === 'Urgent' &&
                            <div className='priority-icon urgent-priority'>{job.priority}</div>
                        }
                    </div>
                </Accordion.Header>
                <Accordion.Body>
                    <Card key={job?.reference} className="job-card">
                        <Card.Body>
                            <Card.Text>{job?.description}</Card.Text>
                            <Card.Text>{job?.date}</Card.Text>
                            <Card.Text>{job?.timeframe}</Card.Text>
                            <Button variant="primary" onClick={handleClick}>View</Button>
                        </Card.Body>
                    </Card>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default JobCard;

