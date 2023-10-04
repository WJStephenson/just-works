import React, { useEffect, useState } from 'react'
import './SelectedJob.css'
import { useParams } from 'react-router'
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

function SelectedJob() {


    useEffect(() => {
        const fetchData = async () => {
            const jobs = collection(db, 'live-jobs');
            const q = query(jobs, where('reference', '==', jobid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                setJob(doc.data());
            });
        };
        fetchData();
    }, [])

    return (
        <div className='selectedjob-container'>
            {job?.length === 0 ? <p>No job selected</p> : <p>{job?.reference}</p>}
        </div>
    )
}

export default SelectedJob