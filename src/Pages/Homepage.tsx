import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../Config/firebaseConfig';
import './Homepage.css';
import AddJobModal from '../Components/AddJobModal/AddJobModal';
import JobCard from '../Components/JobCard/JobCard';

function Homepage() {

    interface Job {
        area: string;
        contractor: string;
        date: string;
        description: string;
        reported_by: string;
        timeframe: string;
        id: string;
    }

    const [liveJobs, setLiveJobs] = useState<Job[]>([]);

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


    return (
        <div>
            <h1>Live Jobs:</h1>
            <JobCard liveJobs={liveJobs} fetchData={fetchData} />
            <AddJobModal fetchData={fetchData} />
            <h1>Add Job</h1>
            
        </div>
    );
}

export default Homepage;

