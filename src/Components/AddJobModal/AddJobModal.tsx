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

    const [validated, setValidated] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        area: '',
        contractor: '',
        date: '',
        timeframe: '',
        description: '',
        reported_by: '',
        reference: '',
        priority: 'low', //default to low
        onHold: false,
        isRecurring: false,
        recurrenceFrequency: 'daily', // Default to monthly
        added: new Date().toLocaleDateString(),
    });


    const handleClose = () => {
        setValidated(false);
        setShowAddModal(false)
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;

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
    // React.MouseEvent<HTMLButtonElement>
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const finalFormData = {
            ...formData,
            reference: formData.reference.trim() === '' ? nanoid() : formData.reference,
        };

        const form = e.currentTarget;
        if (form.checkValidity() === true) {

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
            setValidated(false);
            setFormData({
                name: '',
                area: '',
                contractor: '',
                date: '',
                timeframe: '',
                description: '',
                reported_by: '',
                reference: '',
                priority: 'low', //default to low
                onHold: false,
                isRecurring: false,
                recurrenceFrequency: 'daily', // Default to monthly
                added: new Date().toLocaleDateString(),
            });
        } else {
            setValidated(true);
        }
    };

    return (
        <>
            <Modal show={showAddModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a Job</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Name this Job</Form.Label>
                            <Form.Control
                                name='name'
                                type="text"
                                required
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
                                name='date'
                                type="datetime-local"
                                required
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="timeframe">
                            <Form.Label>Estimated Completion</Form.Label>
                            <Form.Control
                                name='timeframe'
                                type="datetime-local"
                                required
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select name='priority' onChange={handleChange} required>
                                <option value='Low'>Low</option>
                                <option value='Medium'>Medium</option>
                                <option value='High'>High</option>
                                <option value='Urgent'>Urgent</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="area">
                            <Form.Label>Area</Form.Label>
                            <Form.Control
                                name='area'
                                as="textarea"
                                required
                                rows={1}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                name='description'
                                as="textarea"
                                required
                                rows={3}
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="contractor">
                            <Form.Label>Contractor</Form.Label>
                            <Form.Control
                                name='contractor'
                                as="textarea"
                                rows={1}
                                required
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="reported_by" >
                            <Form.Label>Reported By</Form.Label>
                            <Form.Control
                                name='reported_by'
                                as="textarea"
                                rows={1}
                                required
                                onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="reference" >
                            <Form.Label>Job ID</Form.Label>
                            <Form.Control
                                name='reference'
                                as="textarea"
                                rows={1}
                                placeholder='Leave blank to auto-generate'
                                onChange={handleChange} />
                        </Form.Group>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" type='submit'>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddJobModal;