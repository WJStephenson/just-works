import React, { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './MyCalendar.css';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

function MyCalendar() {
    document.title = 'Just Works | Calendar';

    const [value, loading, error] = useCollection(
        collection(db, 'live-jobs'),
        {
            snapshotListenOptions: { includeMetadataChanges: true },
        }
    );

    const [events, setEvents] = useState<EventItem[]>([]);

    interface EventItem {
        title: string;
        start: Date;
        end: Date;
    }

    useEffect(() => {
        if (value) {
            const allEvents: EventItem[] = [];

            value.docs.forEach((doc) => {
                const job = doc.data();

                // If the job is recurring, create recurring events
                if (job.isRecurring) {
                    const recurrenceEvents = createRecurringEvents({
                        start: job.date,
                        complete: job.timeframe,
                        recurrenceFrequency: job.recurrenceFrequency,
                        name: job.name,
                    });
                    allEvents.push(...recurrenceEvents);
                } else {
                    // If it's not recurring, create a single event
                    const singleEvent = {
                        title: job.name,
                        start: job.date,
                        end: job.timeframe,
                    };
                    allEvents.push(singleEvent);
                }
            });
            setEvents(allEvents);
        }
    }, [value]);

    const createRecurringEvents = (job: { // Specify the type for the 'job' parameter
        start: string,
        complete: string,
        recurrenceFrequency: string,
        name: string,
    }) => {
        const recurrenceStartDateTime = moment(`${job.start}`);
        const recurrenceEndDateTime = moment(`${job.complete}`);
        const maxSchedulingDate = moment(recurrenceStartDateTime).add(12, 'months'); // Limit scheduling to the next 12 months
        const recurrenceFrequency = job.recurrenceFrequency;

        const recurringEvents = [];
        const currentDateTime = moment(recurrenceStartDateTime);
        const currentEndDateTime = moment(recurrenceEndDateTime);

        while (currentDateTime.isBefore(maxSchedulingDate)) {
            recurringEvents.push({
                title: job.name,
                start: new Date(currentDateTime.toISOString()),
                end: new Date(currentEndDateTime.toISOString()),
            });


            if (recurrenceFrequency === 'daily') {
                currentDateTime.add(1, 'day');
                currentEndDateTime.add(1, 'day');
            } else if (recurrenceFrequency === 'weekly') {
                currentDateTime.add(1, 'week');
                currentEndDateTime.add(1, 'week');
            } else if (recurrenceFrequency === 'monthly') {
                currentDateTime.add(1, 'month');
                currentEndDateTime.add(1, 'month');
            } else if (recurrenceFrequency === 'quarterly') {
                currentDateTime.add(3, 'months');
                currentEndDateTime.add(3, 'months');
            } else if (recurrenceFrequency === '6 monthly') {
                currentDateTime.add(6, 'months');
                currentEndDateTime.add(6, 'months');
            } else if (recurrenceFrequency === 'annually') {
                currentDateTime.add(1, 'year');
                currentEndDateTime.add(1, 'year');
            }
        }

        return recurringEvents;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {JSON.stringify(error)}</div>;
    }

    return (
        <div className='calendar-container'>
            <Calendar
                localizer={momentLocalizer(moment)}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%', width: '100%' }}
            />
        </div>
    );
}

export default MyCalendar;
