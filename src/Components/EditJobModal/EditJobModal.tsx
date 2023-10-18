import React, { ChangeEvent, useContext, useEffect, useState } from 'react'
import { Modal, Form, Button } from 'react-bootstrap'
import ModalContext from '../../Context/ModalContext';
import { DocumentReference, collection, doc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../Config/firebaseConfig';
import { Job } from '../../Pages/Homepage/Homepage';
import { useCollection } from 'react-firebase-hooks/firestore';
import { MultiValue } from 'react-select';
import Select from 'react-select';

type Option = {
    label: string;
    value: string;
};

type EditJobModalProps = {
    selectedJob: Job;
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
    const [changesSummary, setChangesSummary] = useState<Array<Change>>([]);
    const [formData, setFormData] = useState<Job>(selectedJob);

    const [areaValues] = useCollection(
        collection(db, 'areas'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [contractorValues] = useCollection(
        collection(db, 'contractors'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const handleClose = () => setShowEditJobModal(false);

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
            datetime: new Date().toISOString(),
            user: auth.currentUser?.email,
        };
        try {
            await setDoc(commentRef, commentData);
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
        // Update the formData state when selectedJob changes
        setFormData(selectedJob);
    }, [selectedJob]);

    useEffect(() => {
        // Generate and update the changes summary when formData changes
        const changes = generateChangesSummary(selectedJob, formData);
        setChangesSummary(changes);
    }, [formData, selectedJob]);

    const handleAreaSelectChange = (newValue: MultiValue<Option>) => {
        const selectedOptions = newValue;
        const selectedValues = selectedOptions.map(option => option.value);
        const selectedValuesString = selectedValues.join(', ');

        setFormData((prevFormData) => {
            return {
                ...prevFormData ?? {},
                area: selectedValuesString,
                name: prevFormData?.name ?? '',
                date: prevFormData?.date,
                timeframe: prevFormData?.timeframe,
                contractor: prevFormData?.contractor,
                description: prevFormData?.description,
                reported_by: prevFormData?.reported_by,
                reference: prevFormData?.reference,
                priority: prevFormData?.priority,
                onHold: prevFormData?.onHold,
                isRecurring: prevFormData?.isRecurring,
                recurrenceFrequency: prevFormData?.recurrenceFrequency,
                added: prevFormData?.added,
            } as Job;
        });
    };

    const handleContractorSelectChange = (newValue: MultiValue<Option>) => {
        const selectedOptions = newValue;
        const selectedValues = selectedOptions.map(option => option.value);
        const selectedValuesString = selectedValues.join(', ');

        setFormData((prevFormData) => {
            return {
                ...prevFormData ?? {},
                area: prevFormData?.area ?? '',
                name: prevFormData?.name ?? '',
                date: prevFormData?.date,
                timeframe: prevFormData?.timeframe,
                contractor: selectedValuesString,
                description: prevFormData?.description,
                reported_by: prevFormData?.reported_by,
                reference: prevFormData?.reference,
                priority: prevFormData?.priority,
                onHold: prevFormData?.onHold,
                isRecurring: prevFormData?.isRecurring,
                recurrenceFrequency: prevFormData?.recurrenceFrequency,
                added: prevFormData?.added,
            } as Job;
        });
    };


    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            const jobRef = doc(db, `live-jobs/${identifier}`);
            await updateDoc(jobRef, formData as { [x: string]: string | boolean | undefined | string[]; });
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
                            <Select
                                isMulti
                                onChange={handleAreaSelectChange}
                                name="area"
                                options={areaValues?.docs.map((doc) => ({
                                    value: doc.data().name,
                                    label: doc.data().name,
                                }))
                                }
                                className="basic-multi-select"
                                classNamePrefix="select"
                                defaultValue={selectedJob?.area.split(', ').map((area) => ({
                                    value: area,
                                    label: area,
                                }))
                                }
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
                            <Select
                                isMulti
                                onChange={handleContractorSelectChange}
                                name="contractor"
                                options={contractorValues?.docs.map((doc) => ({
                                    value: doc.data().name,
                                    label: doc.data().name,
                                }))
                                }
                                className="basic-multi-select"
                                classNamePrefix="select"
                                defaultValue={selectedJob?.contractor.split(', ').map((contractor) => ({
                                    value: contractor,
                                    label: contractor,
                                }))
                                }
                            />
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