import React, { useEffect, useState } from 'react';
import './Homepage.css'
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';
import JobCard from '../../Components/JobCard/JobCard';
import AddJobModal from '../../Components/AddJobModal/AddJobModal';
// import Search from '../../Components/Search/Search';

function Homepage() {

    interface Job {
        area: string;
        contractor: string;
        date: string;
        description: string;
        reported_by: string;
        timeframe: string;
        priority: string;
        reference: string;
    }

    const [liveJobs, setLiveJobs] = useState<Job[]>([]);
    const [ selectedJob, setSelectedJob ] = useState<Job>();

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
            <div className='jocard-container'>
                <h1>Live Jobs:</h1>
                <div className='jobcard-wrapper'>
                    <JobCard liveJobs={liveJobs} fetchData={fetchData} setSelectedJob={setSelectedJob} />
                </div>
            </div>
            <div className='selectedjob-container'>
                <h1>Selected Job:</h1>
                {selectedJob?.length === 0 ? <p>No job selected</p> : <p>{selectedJob?.reference}</p>}
            </div>
            <AddJobModal fetchData={fetchData} />
        </div>
    );
}

export default Homepage;

