import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';

function CompletedJobCard({ job }) {

    // name: '',
    //     area: '',
    //     contractor: '',
    //     start: '',
    //     startDate: '',
    //     description: '',
    //     reported_by: '',
    //     complete: '',
    //     completeTime: '',
    //     reference: '',
    //     priority: 'low', //default to low
    //     time: '',
    //     onHold: false,
    //     isRecurring: false,
    //     recurrenceFrequency: 'monthly', // Default to monthly
    //     added: new Date().toLocaleDateString(),

    return (
        <Accordion.Item eventKey={job.reference} key={job.reference} >
            <Accordion.Header>
                {job.name} - {job.area}
            </Accordion.Header>
            <Accordion.Body>
                <Card>
                    <Card.Header as="h5">{job.name}</Card.Header>
                    <Card.Body>
                        <Card.Title>Location: {job.area}</Card.Title>
                        <Card.Text>Description: {job.description}</Card.Text>
                        <Card.Text>Contractor(s): {job.contractor}</Card.Text>
                        <Card.Text>Priority: {job.priority}</Card.Text>
                        <Card.Text>Start: {job.startDate}, {job.start}</Card.Text>
                        <Card.Text>Complete: {job.complete}, {job.completeTime}</Card.Text>
                        <Card.Text>Reported By: {job.reported_by}</Card.Text>
                        <Card.Text>Reference: {job.reference}</Card.Text>
                    </Card.Body>
                </Card>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default CompletedJobCard