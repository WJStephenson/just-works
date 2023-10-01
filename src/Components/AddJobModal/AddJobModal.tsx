import React, { useState } from 'react'
import './AddJobModal.css'
import Modal from 'react-modal'
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import { nanoid } from 'nanoid';


function AddJobModal({ fetchData }) {

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
        },
    };

    // Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
    Modal.setAppElement('#root');

    const [modalIsOpen, setIsOpen] = useState(false);

    function openModal() {
        setIsOpen(true);
    }

    function afterOpenModal() {
    }

    function closeModal() {
        setIsOpen(false);
    }

    const [formData, setFormData] = useState({
        area: '',
        contractor: '',
        date: '',
        description: '',
        reported_by: '',
        timeframe: '',
        reference: ''
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
                fetchData();
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        };
    
        sendData();
        closeModal();
    };

    return (
        <div>
            <button onClick={openModal}>Add Job</button>
            <Modal
                isOpen={modalIsOpen}
                onAfterOpen={afterOpenModal}
                onRequestClose={closeModal}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <h2>Add a Job</h2>
                <button onClick={closeModal}>close</button>
                <form action="" onSubmit={handleSubmit}>
                    <label htmlFor="area">Area</label>
                    <input type="text" name='area' id='area' value={formData.area} onChange={handleChange} />
                    <label htmlFor="contractor">Contractor</label>
                    <input type="text" name='contractor' id='contractor' value={formData.contractor} onChange={handleChange} />
                    <label htmlFor="date">Date</label>
                    <input type="date" name='date' id='date' value={formData.date} onChange={handleChange} />
                    <label htmlFor="description">Description</label>
                    <input type="text" name='description' id='description' value={formData.description} onChange={handleChange} />
                    <label htmlFor="reported_by">Reported By</label>
                    <input type="text" name='reported_by' id='reported_by' value={formData.reported_by} onChange={handleChange} />
                    <label htmlFor="area">timeframe</label>
                    <input type="date" name='timeframe' id='timeframe' value={formData.timeframe} onChange={handleChange} />
                    <label htmlFor="area">Reference</label>
                    <input type="text" name='reference' id='reference' placeholder={nanoid()} onChange={handleChange} />
                    <button type='submit'>Submit</button>
                </form>
            </Modal>
        </div>
    );
}

export default AddJobModal;