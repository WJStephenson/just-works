import React, { useEffect, useState } from 'react';
import './Homepage.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import AddJobModal from '../../Components/AddJobModal/AddJobModal';
import JobCard from '../../Components/JobCard/JobCard';
// import Search from '../../Components/Search/Search';

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
        <div className='homepage-container'>
            <div></div>
            <div>
                <h1>Live Jobs:</h1>
                <div className='jobcard-wrapper'>
                    <JobCard liveJobs={liveJobs} fetchData={fetchData} />
                </div>
            </div>
            <AddJobModal fetchData={fetchData} />
        </div>
    );
}

export default Homepage;

