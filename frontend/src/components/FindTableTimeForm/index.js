import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import './FindTableTimeForm.css';
import { fetchRestaurant, selectRestaurant } from "../../store/restaurants";
import React, { useState, useEffect, useRef } from 'react';

const FindTableTime = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const restaurant = useSelector(selectRestaurant(id));

    const [openingTime, closingTime] = restaurant.hours.split(' - ');
    const [selectedDate, setSelectedDate] = useState(new Date());

    const hiddenDateInputRef = useRef(null);

    useEffect(() => {
        dispatch(fetchRestaurant(id));
      }, [dispatch, id]);

    if (!restaurant) {
        return;
    }

    const partySizeOptions = [];
    for (let i = 1; i <= 20; i++) {
        partySizeOptions.push(i);
    }

    // Generate time slots in 30-minute increments
    const generateTimeSlots = () => {
        const convertToMinutes = (time) => {
            const [hoursMinutes, period] = time.split(' ');
            let [hours, minutes] = hoursMinutes.split(':');
            hours = parseInt(hours);
            if (period === 'PM' && hours < 12) hours += 12;
            if (period === 'AM' && hours === 12) hours = 0;
            return hours * 60 + parseInt(minutes);
        };

        const convertTo12HourFormat = (minutes) => {
            const hours = Math.floor(minutes / 60) % 24;
            const mins = minutes % 60;
            const period = hours < 12 ? 'AM' : 'PM';
            const displayHour = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
            return `${displayHour}:${mins.toString().padStart(2, '0')} ${period}`;
        };

        const lastResMinutes = convertToMinutes(closingTime) - 90;
        const lastResHour = lastResMinutes < 0 ? convertTo12HourFormat(lastResMinutes + 24 * 60) : convertTo12HourFormat(lastResMinutes);
        console.log("lastResHour", lastResHour)

        const timeSlots = [];
        const timePeriods = ['AM', 'PM'];
    
        timePeriods.forEach(amPm => {
            for (let hour = 1; hour <= 12; hour++) {
                for (let minute = 0; minute < 60; minute += 30) {
                    const displayHour = hour === 0 ? 12 : hour;
                    const time = `${displayHour}:${minute.toString().padStart(2, '0')} ${amPm}`;
                    timeSlots.push(time);
                }
            }
        });
    
        const startIndex = timeSlots.indexOf(openingTime);
        const endIndex = timeSlots.indexOf(lastResHour);
        if (endIndex < startIndex) {
            return [...timeSlots.slice(startIndex), ...timeSlots.slice(0, endIndex + 1)];
        } else {
            return timeSlots.slice(startIndex, endIndex + 1);
        }
    };
    
    const timeSlots = generateTimeSlots();

    // Function to format the date as per your requirement
    const formatDate = (date) => {
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    // Function to handle the date selection
    const handleDateChange = (e) => {
        setSelectedDate(e.target.valueAsDate);
    };

    function getTodaysDate() {
        const date = new Date(); // Get the current date
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
      }

    return (
        <form>
            <div class="table-time-container">
                <h4>Make a reservation</h4>
                <h5>Party Size</h5>
                <select>
                    {partySizeOptions.map(option => (
                        <option key={option} value={option} selected={option === 2}>{option} {option !== 1 ? 'people' : 'person'}</option>
                    ))}
                </select>
                <div id="date-time-container">
                    <div id="date-input">
                        <h5>Date</h5>
                        {/* <input type="date" value={getTodaysDate()}/> */}
                        <select></select>
                    </div>
                    <div id="time-input">
                        <h5>Time</h5>
                        <select>
                            {timeSlots.map((timeSlot, index) => (
                                <option key={index} value={timeSlot}>
                                    {timeSlot}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <button id="find-time-bttn">Find a time</button>
            </div>
        </form>
    )
}

export default FindTableTime;