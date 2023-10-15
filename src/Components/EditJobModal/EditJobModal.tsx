import React, { useContext, useEffect, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import ModalContext from '../../Context/ModalContext';
import { collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';

function EditJobModal({ selectedJob, setSelectedJob, identifier }) {

    const { showEditJobModal, setShowEditJobModal } = useContext(ModalContext);

    const handleClose = () => setShowEditJobModal(false);

    const [changesSummary, setChangesSummary] = useState([]);

    const [formData, setFormData] = useState({
        name: selectedJob.name,
        area: selectedJob.area,
        contractor: selectedJob.contractor,
        start: selectedJob.start,
        complete: selectedJob.complete,
        description: selectedJob.description,
        reported_by: selectedJob.reported_by,
        reference: selectedJob.reference,
        priority: selectedJob.priority,
        time: selectedJob.time,
        onHold: selectedJob.onHold,
        isRecurring: selectedJob.isRecurring,
        recurrenceFrequency: selectedJob.recurrenceFrequency,
        added: selectedJob.added,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                [name]: type === 'checkbox' ? checked : value,
            };
        });
    };

    const generateChangesSummary = (originalData, editedData) => {
        const changes = [];

        for (const key in editedData) {
            if (originalData[key] !== editedData[key]) {
                changes.push({
                    field: key,
                    oldValue: originalData[key],
                    newValue: editedData[key],
                });
            }
        }

        return changes;
    };

    const addCommentToJob = async (jobRef, changesSummary) => {
        const commentsCollectionRef = collection(jobRef, 'comments');
        const commentRef = doc(commentsCollectionRef);

        const commentData = {
            comment: generateChangeComments(changesSummary),
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            user: auth.currentUser?.displayName,
        };

        try {
            await setDoc(commentRef, commentData);
            console.log('Comment added successfully');
        } catch (error) {
            console.error('Error adding comment: ', error);
        }
    };

    const generateChangeComments = (changesSummary) => {
        const changeComments = [];

        changesSummary.forEach((change) => {
            const { field, oldValue, newValue } = change;

            // Capitalize the first letter of the field name
            const capitalizedField = field.charAt(0).toUpperCase() + field.slice(1);

            // Enclose the change information in quotes
            const comment = `${capitalizedField} changed from "${oldValue}" to "${newValue}"`;

            changeComments.push(comment);
        });

        return changeComments.join(', ');
    };

    useEffect(() => {
        // Generate and update the changes summary when formData changes
        const changes = generateChangesSummary(selectedJob, formData);
        setChangesSummary(changes);
    }, [formData, selectedJob]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData);
        try {
            const jobRef = doc(db, `live-jobs/${identifier}`);
            await updateDoc(jobRef, formData);
            setSelectedJob(formData);
            setShowEditJobModal(false);
            await addCommentToJob(jobRef, changesSummary);
            setChangesSummary([]);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <>
            <Modal show={showEditJobModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit a Job</Modal.Title>
                </Modal.Header>
                <Modal.Header>Created: {selectedJob.added}</Modal.Header>
                <Modal.Header>Reference: {selectedJob.reference}</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Rename this Job</Form.Label>
                            <Form.Control
                                name='name'
                                type="text"
                                defaultValue={selectedJob.name}
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Start</Form.Label>
                            <Form.Control
                                name='start'
                                type="datetime-local"
                                defaultValue={selectedJob.start}
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="timeframe">
                            <Form.Label>Estimated Completion</Form.Label>
                            <Form.Control
                                name='complete'
                                type="datetime-local"
                                defaultValue={selectedJob.complete}
                                autoFocus
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select name='priority' onChange={handleChange} required autoFocus defaultValue={selectedJob.priority}>
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
                                defaultValue={selectedJob.area}
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
                                defaultValue={selectedJob.description}
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
                                defaultValue={selectedJob.contractor}
                                rows={1}
                                onChange={handleChange} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="secondary" onClick={handleSubmit}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default EditJobModal