import { Button, Form, InputGroup, ListGroup } from 'react-bootstrap';
import './Settings.css';
import { auth, db } from '../../Config/firebaseConfig';
import { CollectionReference, addDoc, collection } from 'firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';
import ListItem from '../../Components/ListItem/ListItem';
import { nanoid } from 'nanoid';

function Settings() {
    document.title = 'Just Works | Settings';

    const [machinesValue, machinesLoading] = useCollection(
        collection(db, 'machines'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [contractorsValue, contractorsLoading] = useCollection(
        collection(db, 'contractors'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [areasValue, areasLoading] = useCollection(
        collection(db, 'areas'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );


    const handleMachineAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const machineName = (e.currentTarget[0] as HTMLInputElement).value;
        const machinesRef = collection(db, 'machines');
        try {
            await sendData(machinesRef, machineName);
        }
        catch (e) {
            console.error('Error adding document:', e);
        }
    }

    const handleContractorAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const contractorName = (e.currentTarget[0] as HTMLInputElement).value;
        const constractorsRef = collection(db, 'contractors');
        try {
            await sendData(constractorsRef, contractorName);
        }
        catch (e) {
            console.error('Error adding document:', e);
        }
    }

    const handleAreaAdd = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const areaName = (e.currentTarget[0] as HTMLInputElement).value;
        const areasRef = collection(db, 'areas');
        try {
            await sendData(areasRef, areaName);
        }
        catch (e) {
            console.error('Error adding document:', e);
        }
    }

    const sendData = async (collection: CollectionReference, name: string) => {
        try {
            await addDoc(collection, { name }); // Assumes 'name' is a field in the document.
        } catch (e) {
            console.error('Error adding document:', e);
        }
    };

    return (
        <div className='settings-wrapper'>
            <h1>Settings - signed in as {auth.currentUser?.email}</h1>
            <p>Add Machines, Contractors or Areas by typing the name in the relevant input area and clicking 'Add'. To remove an item, hover over it and click on the 'X' icon. </p>
            <br />
            <div className='settings-container'>
                <div className='settings-machines'>
                    <h2>Machines</h2>
                    <p><strong>Not Currently Used</strong></p>
                    <Form onSubmit={handleMachineAdd}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Machine Name"
                                aria-label="Machine Name"
                                aria-describedby="basic-addon2"
                                required
                            />
                            <Button variant="danger" id="button-addon2" type='submit'>
                                Add
                            </Button>
                        </InputGroup>
                    </Form>
                    <div>
                        <ListGroup>
                            {machinesLoading && <span>Loading Machines...</span>}
                            {
                                machinesValue?.docs.length == 0 ? <ListItem key={nanoid()} item='No Machines Stored' docId='' collection='' />
                                    :
                                    <>
                                        {machinesValue?.docs.map((doc) => (
                                            <ListItem key={doc.id} item={doc.data().name} docId={doc.id} collection='machines' />
                                        ))}
                                    </>

                            }
                        </ListGroup>
                    </div>
                </div>
                <div className='settings-contractors'>
                    <h2>Contractors</h2>
                    <Form onSubmit={handleContractorAdd}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Contractors Name"
                                aria-label="Contractors Name"
                                aria-describedby="basic-addon2"
                                required
                            />
                            <Button variant="success" id="button-addon2" type='submit'>
                                Add
                            </Button>
                        </InputGroup>
                    </Form>
                    <div>
                        <ListGroup>
                            {contractorsLoading && <span>Loading Machines...</span>}
                            {
                                contractorsValue?.docs.length == 0 ? <ListItem key={nanoid()} item='No Contractors Stored' docId='' collection='' />
                                    :
                                    <>
                                        {contractorsValue?.docs.map((doc) => (
                                            <ListItem key={doc.id} item={doc.data().name} docId={doc.id} collection='contractors' />
                                        ))}
                                    </>

                            }
                        </ListGroup>
                    </div>
                </div>
                <div className='settings-areas'>
                    <h2>Areas</h2>
                    <Form onSubmit={handleAreaAdd}>
                        <InputGroup className="mb-3">
                            <Form.Control
                                placeholder="Area Name"
                                aria-label="Area Name"
                                aria-describedby="basic-addon2"
                                required
                            />
                            <Button variant="success" id="button-addon2" type='submit'>
                                Add
                            </Button>
                        </InputGroup>
                    </Form>
                    <div>
                        <ListGroup>
                            {areasLoading && <span>Loading Machines...</span>}
                            {
                                areasValue?.docs.length == 0 ? <ListItem key={nanoid()} item='No Areas Stored' docId='' collection='' />
                                    :
                                    <>
                                        {areasValue?.docs.map((doc) => (
                                            <ListItem key={doc.id} item={doc.data().name} docId={doc.id} collection='areas' />
                                        ))}
                                    </>

                            }
                        </ListGroup>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;