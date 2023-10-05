import React, { useState, useContext } from 'react'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { nanoid } from 'nanoid';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ModalContext from '../../Context/ModalContext';


function AddJobModal() {

    const { show, setShow } = useContext(ModalContext);

    const handleClose = () => setShow(false);

    const [formData, setFormData] = useState({
        name: '',
        area: '',
        contractor: '',
        date: '',
        description: '',
        reported_by: '',
        timeframe: '',
        reference: '',
        priority: '',
        time: '',
        onHold: false
    });


    const handleChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;

        // Check if the name is "reference" and the value is empty
        if (name === "reference" && value.trim() == "") {
            setFormData({
                ...formData,
                [name]: nanoid() // Set to nanoid value
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if the 'reference' field is empty, and if so, set it to a nanoid value
        const finalFormData = {
            ...formData,
            reference: formData.reference.trim() === "" ? nanoid() : formData.reference
        };

        console.log(finalFormData);

        const sendData = async () => {
            try {
                const docRef = await addDoc(collection(db, "live-jobs"), finalFormData);
                console.log("Document written with ID: ", docRef.id, finalFormData);
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        };

        sendData();
        setShow(false);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name this Job</Form.Label>
                            <Form.Control
                                name='name'
                                type="text"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Date Raised</Form.Label>
                            <Form.Control
                                name='date'
                                type="date"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="time">
                            <Form.Label>Time Raised</Form.Label>
                            <Form.Control
                                name='time'
                                type="time"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select name='priority' onChange={handleChange} required autoFocus>
                                <option value='Low'>Low</option>
                                <option value='Medium'>Medium</option>
                                <option value='High'>High</option>
                                <option value='Urgent'>Urgent</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="timeframe">
                            <Form.Label>Estimated Completion Date</Form.Label>
                            <Form.Control
                                name='timeframe'
                                type="date"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="area"
                        >
                            <Form.Label>Area</Form.Label>
                            <Form.Control
                                name='area'
                                as="textarea"
                                rows={1}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="description"
                        >
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name='description'
                                as="textarea"
                                rows={3}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="contractor"
                        >
                            <Form.Label>Contractor</Form.Label>
                            <Form.Control
                                name='contractor'
                                as="textarea"
                                rows={1}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="reported_by"
                        >
                            <Form.Label>Reported By</Form.Label>
                            <Form.Control
                                name='reported_by'
                                as="textarea"
                                rows={1}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="reference"
                        >
                            <Form.Label>Job ID</Form.Label>
                            <Form.Control
                                name='reference'
                                as="textarea"
                                rows={1}
                                placeholder='Leave blank to auto-generate'
                                onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddJobModal;