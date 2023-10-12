import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

function CompletedJobCard({ job }) {

    return (
        <Accordion.Item eventKey={job.reference} key={job.reference} >
            <Accordion.Header>
                {job.title}
                {job.onHold === true && <div className='onhold-icon'>On Hold</div>}
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
            </Accordion.Header>
            <Accordion.Body>
                <Card>
                    <Card.Header as="h5">{job.name}</Card.Header>
                    <Card.Body>
                        <Card.Title>{job.area}</Card.Title>
                        <Card.Text>{job.description}</Card.Text>
                        <Card.Text>{job.contractor}</Card.Text>
                        <Card.Text>{job.date}</Card.Text>
                        <Card.Text>{job.reported_by}</Card.Text>
                        <Card.Text>{job.timeframe}</Card.Text>
                        <Card.Text>{job.priority}</Card.Text>
                        <Card.Text>{job.reference}</Card.Text>
                    </Card.Body>
                </Card>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default CompletedJobCard