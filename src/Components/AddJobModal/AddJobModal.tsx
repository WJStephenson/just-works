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
        id: nanoid()
    });



    const handleChange = (e) => {
        e.preventDefault()
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formData)
        const sendData = async () => {
            try {
                const docRef = await addDoc(collection(db, "live-jobs"), formData);
                console.log("Document written with ID: ", docRef.id, formData);
                fetchData()
            } catch (e) {
                console.error("Error adding document: ", e);
            }
        }
        sendData()
        closeModal()
    }

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
                    <button type='submit'>Submit</button>
                </form>
            </Modal>
        </div>
    );
}

export default AddJobModal;