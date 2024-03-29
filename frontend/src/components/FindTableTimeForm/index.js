import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom';
import { fetchRestaurant, selectRestaurant } from "../../store/restaurants";
import React, { useState, useEffect, useRef } from 'react';
import datePicker from 'js-datepicker';
import 'js-datepicker/dist/datepicker.min.css';
import './TableCalendar.css';
import './FindTableTimeForm.css';
import { setSelectedTime, setSelectedDate, setSelectedSize } from '../../store/reservations';
import LoginForm from "../LoginFormModal/LoginForm";
import { Modal } from '../../context/Modal';

const FindTableTime = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const restaurant = useSelector(selectRestaurant(id));
    const selectedTime = useSelector(state => state.reservations.selectedTime);
    const selectedDate = useSelector(state => state.reservations.selectedDate);
    const selectedSize = useSelector(state => state.reservations.selectedSize);
    const [showModal, setShowModal] = useState(false);
    const user = useSelector(state => state.session.user);

    let openingTime, closingTime;
    if (restaurant && restaurant.hours) {
        [openingTime, closingTime] = restaurant.hours.split(' - ');
    }

    const [suggestedTimes, setSuggestedTimes] = useState([]);

    let history = useHistory();

    useEffect(() => {
        dispatch(fetchRestaurant(id));
    }, [dispatch, id]);

    const datePickerRef = useRef(null);

    useEffect(() => {
        if (!datePickerRef.current) {
            datePickerRef.current = datePicker('.date-picker', {
                dateSelected: new Date(selectedDate),
                formatter: (input, date, instance) => {
                    const options = { month: 'short', day: 'numeric', year: 'numeric' };
                    input.value = new Intl.DateTimeFormat('en-US', options).format(date);
                },
                onSelect: (instance, date) => {
                    dispatch(setSelectedDate(new Date(date).toLocaleDateString('en-US')));
                },
                showAllDates: true,
                minDate: new Date()
            });
        }
    }, []);
    
    if (!restaurant) {
        return;
    }

    const partySizeOptions = [];
    for (let i = 1; i <= 20; i++) {
        partySizeOptions.push(i);
    }

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

    // Generate time slots for time input drop down in 30-minute increments
    const generateTimeSlots = () => {

        const lastResMinutes = convertToMinutes(closingTime) - 90;
        const lastResHour = lastResMinutes < 0 ? convertTo12HourFormat(lastResMinutes + 24 * 60) : convertTo12HourFormat(lastResMinutes);

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

    const getSuggestedTimes = (selectedTime) => {
        const times = [];
    
        const selectedMinutes = convertToMinutes(selectedTime);
        const openingMinutes = convertToMinutes(openingTime);
        const closingMinutes = convertToMinutes(closingTime) - 90;
    
        const intervals = [-30, -15, 0, 15, 30];
    
        intervals.forEach(interval => {
            const newTime = selectedMinutes + interval;
            if (newTime >= openingMinutes && newTime <= closingMinutes) {
                times.push(convertTo12HourFormat(newTime));
            }
        });
    
        return times;
    };
    
    const handleTimeSelect = (time) => {
        if (!user) {
            setShowModal(true);
            return;
        }

        dispatch(setSelectedTime(time));
        console.log("setSelectedTime:", selectedTime)
        dispatch(setSelectedDate(selectedDate));
        dispatch(setSelectedSize(selectedSize));
        history.push(`/restaurants/${restaurant.id}/create?partySize=${selectedSize}&time=${time}&date=${selectedDate}`);
    }

    return (
        <>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <LoginForm onClose={() => setShowModal(false)} />
                </Modal>
            )}

            <form>
                <div className="table-time-container">
                    <h4>Make a reservation</h4>
                    <h5>Party Size</h5>
                    <select defaultValue={selectedSize} id="party-size" onChange={(e) => dispatch(setSelectedSize(e.target.value))}>
                        {partySizeOptions.map(option => (
                            <option key={option} value={option}>
                                {option} {option !== 1 ? 'people' : 'person'}
                            </option>
                        ))}
                    </select>
                    <div id="date-time-container">
                        <div id="date-input">
                            <h5>Date</h5>
                            <input type="text" className="date-picker" />
                        </div>
                        <div id="time-input">
                            <h5>Time</h5>
                            <select value={selectedTime} onChange={(e) => dispatch(setSelectedTime(e.target.value))}>
                                {timeSlots.map((timeSlot, index) => (
                                    <option key={index} value={timeSlot}>
                                        {timeSlot}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <button id="find-time-bttn" onClick={e => {
                        e.preventDefault();
                        setSuggestedTimes(getSuggestedTimes(selectedTime));
                    }}>Find a time</button>
                    <div className="times-container">
                        {suggestedTimes.length > 0 && <h5>Select a time</h5>}
                        <div>
                            {
                                suggestedTimes.map((time, index) => (
                                    <button key={index} className="suggested-time-bttn" onClick={(e) => {
                                        e.preventDefault();
                                        handleTimeSelect(time);
                                    }}>
                                        {time}
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default FindTableTime;