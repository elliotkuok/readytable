import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './ModifyReservationForm.css';
import { patchReservation, selectReservation } from '../../store/reservations';

const ModifyReservationForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams(); 
    const reservation = useSelector(selectReservation(id));
    const restaurant = useSelector(state => state.restaurants[id.restaurantId]);
    const user = useSelector(state => state.session.user);
    const selectedTime = useSelector(state => state.reservations.selectedTime);
    const selectedDate = useSelector(state => state.reservations.selectedDate);
    const selectedSize = useSelector(state => state.reservations.selectedSize);

    const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");

    const handlePhoneNumberChange = (event) => {
        setPhoneNumber(event.target.value);
    };    

    const completeReservation = async (e) => {
        e.preventDefault();

        const date = selectedDate;
        const time = selectedTime;
        const party_size = parseInt(selectedSize, 10);
        const user_id = user.id
        const restaurant_id = parseInt(id, 10)

        const reservationData = {
            id,
            restaurant_id,
            user_id,
            date,
            time,
            party_size,
        };

        const newReservation = await dispatch(patchReservation(reservationData));

        if (newReservation && newReservation.payload.reservation.id) {
            history.push(`/reservations/${newReservation.payload.reservation.id}`);
        } else {
            console.error("Error creating reservation.");
        }
    }

    return (
        <div className='reservation-page-container'>
            <div className='res-request-container'>
                <h4>Modify your reservation</h4>
                <div className='res-details-container'>
                    <div className='res-img-container'>
                        <img
                        src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                        alt="Placeholder"
                        style={{ width: '4rem', height: '4rem', borderRadius: '4px' }}
                        />
                    </div>
                    <div className='res-request-info'>
                    <h1>{reservation?.restaurantName}</h1>
                        <div className='table-details'>
                            <div id='res-date'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M17,5 L19,5 C20.1045695,5 21,5.8954305 21,7 L21,19 C21,20.1045695 20.1045695,21 19,21 L5,21 C3.8954305,21 3,20.1045695 3,19 L3,7 C3,5.8954305 3.8954305,5 5,5 L7,5 L7,4 C7,3.44771525 7.44771525,3 8,3 C8.55228475,3 9,3.44771525 9,4 L9,5 L15,5 L15,4 C15,3.44771525 15.4477153,3 16,3 C16.5522847,3 17,3.44771525 17,4 L17,5 Z M19,9 L19,7 L5,7 L5,9 L19,9 Z M19,11 L5,11 L5,19 L19,19 L19,11 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <p>{selectedDate}</p>
                            </div>
                            <div id='res-time'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M13,11 L14.5,11 C14.7761424,11 15,11.2238576 15,11.5 L15,12.5 C15,12.7761424 14.7761424,13 14.5,13 L12.5,13 L11.5,13 C11.2238576,13 11,12.7761424 11,12.5 L11,7.5 C11,7.22385763 11.2238576,7 11.5,7 L12.5,7 C12.7761424,7 13,7.22385763 13,7.5 L13,11 Z M12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 Z M12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <p>{selectedTime}</p>
                            </div>
                            <div id='res-size'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M14.5734892,12.2877361 C17.0042328,12.8819383 18.7345621,14.3964534 19.7644773,16.8312813 C19.9208947,17.2010684 20.0014914,17.5984917 20.0014914,18 C20.0014914,19.6568477 18.658351,20.9999882 17.0015032,20.9999882 L6.99926923,21 C6.59776067,21 6.2003371,20.9194033 5.83054967,20.7629859 C4.3045986,20.1175199 3.59082441,18.3572386 4.23628386,16.8312848 C5.26612228,14.3966359 6.99627139,12.8821638 9.42673118,12.2878687 C7.97272602,11.4134027 7,9.82029752 7,8 C7,5.23857625 9.23857625,3 12,3 C14.7614237,3 17,5.23857625 17,8 C17,9.82020554 16.0273723,11.4132417 14.5734892,12.2877361 Z M12,5 C10.3431458,5 9,6.34314575 9,8 C9,9.65685425 10.3431458,11 12,11 C13.6568542,11 15,9.65685425 15,8 C15,6.34314575 13.6568542,5 12,5 Z M17.9429826,17.6856919 C17.1294316,15.228564 15.1485327,14 12.000286,14 C8.85208947,14 6.87106303,15.2285248 6.05720667,17.6855743 L6.05721876,17.6855783 C5.88356446,18.2098444 6.16779141,18.7756206 6.69205743,18.9492749 C6.79348438,18.9828708 6.89964014,18.9999945 7.00648636,18.9999945 L16.99371,18.9999469 C17.5459684,18.9999469 17.9936623,18.552253 17.9936623,17.9999945 C17.9936623,17.8931928 17.9765523,17.7870807 17.9429826,17.6856919 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <p>{selectedSize}</p>
                            </div>
                        </div>
                    </div>

                </div>
                {/* <div className='timer-banner'>
                    <p>You can still try to complete your reservation, but this table may no longer be available.</p>
                </div> */}
                <div className='diner-details-container'>
                    <div className='diner-name'>
                        <h4>Diner details</h4>
                    </div>
                    <h4>{user.firstName} {user.lastName} (<span id='highlight'>Not {user.firstName}?</span>)</h4>
                    <form>
                        <div className='input-row'>
                            <input value={phoneNumber} onChange={handlePhoneNumberChange}></input>
                            <input value={user.email} readOnly />
                        </div>
                        <div className='input-row'>
                            <textarea placeholder={"occasion"}></textarea>
                            <textarea placeholder={"request"}></textarea>
                        </div>
                        <button id='make-res-bttn' onClick={completeReservation}>Complete reservation</button>
                    </form>
                    <div id='terms'>
                        <p>
                            By clicking “Complete reservation” you agree to the <span>
                            OpenTable Terms of Use</span> and <span>Privacy Policy</span>. 
                            Message & data rates may apply. You can opt out of receiving text 
                            messages at any time in your account settings or by replying STOP.
                        </p>
                    </div>
                </div>
            </div>
            <div className='restaurant-note'>
                <h4>What to know before you go</h4>
                <h5>Important dining information</h5>
                <p>We have a 15 minute grace period. Please call us if you are running later than 15 minutes after your reservation time.</p>
                <p>We may contact you about this reservation, so please ensure your email and phone number are up to date.</p>
                <p>Your table will be reserved for 1 hour 45 minutes for parties of up to 2; 2 hours 15 minutes for parties of up to 6; and 2 hours for parties of 7+.</p>
                <h5>A note from the restaurant</h5>
                <p>Thank you for joining us at {reservation?.restaurantName}! We look forward to taking care of you!</p>
                <p>If you are running behind, please let us know. We are happy to hold your table for 15 minutes before releasing to the next guest.</p>
            </div>
        </div>
    )
}

export default ModifyReservationForm;