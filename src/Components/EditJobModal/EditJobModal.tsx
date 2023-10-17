import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import ModalContext from '../../Context/ModalContext';
import { DocumentReference, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import { Job } from '../../Pages/Homepage/Homepage';

type EditJobModalProps = {
    selectedJob: Job | null;
    setSelectedJob: React.Dispatch<React.SetStateAction<Job | null>>;
    identifier: string;
}

type Change = {
    field: string;
    oldValue: string | boolean;
    newValue: string | boolean;
}

function EditJobModal({ selectedJob, setSelectedJob, identifier }: EditJobModalProps) {

    const { showEditJobModal, setShowEditJobModal } = useContext(ModalContext);

    const handleClose = () => setShowEditJobModal(false);

    const [changesSummary, setChangesSummary] = useState<Array<Change>>([]);

    const [formData, setFormData] = useState<Job>(selectedJob);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;
    
        setFormData((prevFormData) => {
            return {
                ...prevFormData ?? {},
                [name]: type === 'checkbox' ? e.target.checked : value,
                name: name === 'name' ? value as string : prevFormData?.name,
            } as Job;
        });
    }
    
    const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
    
        setFormData((prevFormData) => {
            return {
                ...prevFormData ?? {},
                [name]: value,
                name: name === 'name' ? value as string : prevFormData?.name,
            } as Job;
        });
    }


    const generateChangesSummary = (originalData: Job | null, editedData: Job) => {
        const changes = [];

        if (originalData) {
            for (const key in editedData) {
                if (originalData[key as keyof Job] !== editedData[key as keyof Job]) {
                    changes.push({
                        field: key,
                        oldValue: originalData[key as keyof Job],
                        newValue: editedData[key as keyof Job],
                    });
                }
            }
        }

        return changes;
    };

    const addCommentToJob = async (jobRef: DocumentReference, changesSummary: Change[]) => {
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

    const generateChangeComments = (changesSummary: Change[]) => {
        const changeComments: Array<string> = [];

        changesSummary.forEach((change: Change) => {
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



    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        console.log(formData);
        try {
            const jobRef = doc(db, `live-jobs/${identifier}`);
            await updateDoc(jobRef, formData as { [x: string]: string | boolean | undefined });
            setSelectedJob(formData);
            setFormData(null);
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
                <Modal.Header>Created: {selectedJob?.added}</Modal.Header>
                <Modal.Header>Reference: {selectedJob?.reference}</Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Label>Rename this Job</Form.Label>
                            <Form.Control
                                name='name'
                                type="text"
                                defaultValue={selectedJob?.name}
                                autoFocus
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Start</Form.Label>
                            <Form.Control
                                name='date'
                                type="datetime-local"
                                defaultValue={selectedJob?.date}
                                autoFocus
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="timeframe">
                            <Form.Label>Estimated Completion</Form.Label>
                            <Form.Control
                                name='timeframe'
                                type="datetime-local"
                                defaultValue={selectedJob?.timeframe}
                                autoFocus
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="priority">
                            <Form.Label>Priority</Form.Label>
                            <Form.Select name='priority' onChange={handleSelectChange} required autoFocus defaultValue={selectedJob?.priority}>
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
                                defaultValue={selectedJob?.area}
                                rows={1}
                                onChange={handleInputChange}
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
                                defaultValue={selectedJob?.description}
                                rows={3}
                                onChange={handleInputChange} />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="contractor"
                        >
                            <Form.Label>Contractor</Form.Label>
                            <Form.Control
                                name='contractor'
                                as="textarea"
                                defaultValue={selectedJob?.contractor}
                                rows={1}
                                onChange={handleInputChange} />
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