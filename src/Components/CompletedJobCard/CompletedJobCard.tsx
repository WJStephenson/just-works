import Card from 'react-bootstrap/Card';

function CompletedJobCard({ job }) {

    // interface Job {
    //     name: string;
    //     area: string;
    //     contractor: string;
    //     date: string;
    //     description: string;
    //     reported_by: string;
    //     timeframe: string;
    //     priority: string;
    //     reference: string;
    //     onHold: boolean;
    // }

    return (
        <div>
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
        </div>
    )
}

export default CompletedJobCard