import React, { useEffect, useState } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';
import './Homepage.css';
import { nanoid } from 'nanoid';

function Homepage() {

    interface Job {
        area: string;
        contractor: string;
        date: string;
        description: string;
        reported_by: string;
        timeframe: string;
    }

    const [liveJobs, setLiveJobs] = useState<Job[]>([]);
    const [formData, setFormData] = useState({
        area: '',
        contractor: '',
        date: '',
        description: '',
        reported_by: '',
        timeframe: ''
    });

    const fetchData = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'live-jobs'));
            const jobsData = querySnapshot.docs.map((doc) => doc.data());
            setLiveJobs(jobsData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData()
    }, [])


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
    }

    return (
        <div>
            <h1>Live Jobs:</h1>
            <ul>
                {liveJobs.map((job) => (
                    <>
                        <h2 key={nanoid()}>{job.area}</h2>
                        <ul key={nanoid()}>
                            <li>Contractor: {job.contractor}</li>
                            <li>Date: {job.date}</li>
                            <li>Description: {job.description}</li>
                            <li>Reported By: {job.reported_by}</li>
                            <li>Timeframe: {job.timeframe}</li>
                        </ul>
                    </>
                ))}
            </ul>
            <h1>Add Job</h1>
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
        </div>
    );
}

export default Homepage;

