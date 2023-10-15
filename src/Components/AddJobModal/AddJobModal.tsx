import React, { useState, useContext } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { nanoid } from 'nanoid';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import ModalContext from '../../Context/ModalContext';

function AddJobModal() {
    const { showAddModal, setShowAddModal } = useContext(ModalContext);
    const handleClose = () => setShowAddModal(false);

    const [formData, setFormData] = useState({
        name: '',
        area: '',
        contractor: '',
        start: '',
        complete: '',
        description: '',
        reported_by: '',
        reference: '',
        priority: 'low', //default to low
        time: '',
        onHold: false,
        isRecurring: false,
        recurrenceFrequency: 'daily', // Default to monthly
        added: new Date().toLocaleDateString(),
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const finalFormData = {
            ...formData,
            reference: formData.reference.trim() === '' ? nanoid() : formData.reference,
        };

        console.log(finalFormData);

        const sendData = async () => {
            try {
                const docRef = await addDoc(collection(db, 'live-jobs'), finalFormData);
                console.log('Document written with ID: ', docRef.id, finalFormData);
            } catch (e) {
                console.error('Error adding document: ', e);
            }
        };

        sendData();
        setShowAddModal(false);
    };

    return (
        <>
            <Modal show={showAddModal} onHide={handleClose}>
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
                        <Form.Group className="mb-3" controlId="isRecurring">
                            <Form.Check
                                name="isRecurring"
                                type="checkbox"
                                label="Recurring Job"
                                onChange={handleChange}
                            />
                        </Form.Group>
                        {
                            formData.isRecurring && (
                                <Form.Group className="mb-3" controlId="recurrenceFrequency">
                                    <Form.Label>Recurrence Frequency</Form.Label>
                                    <Form.Select name="recurrenceFrequency" onChange={handleChange} required>
                                        <option value="daily">Daily</option>
                                        <option value="weekly">Weekly</option>
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="6 monthly">6 Monthly</option>
                                        <option value="annually">Annually</option>
                                    </Form.Select>
                                </Form.Group>
                            )
                        }
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Start</Form.Label>
                            <Form.Control
                                name='start'
                                type="datetime-local"
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="timeframe">
                            <Form.Label>Estimated Completion</Form.Label>
                            <Form.Control
                                name='complete'
                                type="datetime-local"
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