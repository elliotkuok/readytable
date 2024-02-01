import React, { useEffect } from 'react';
import restaurantImage from './assets/restaurant.jpg';
import './RestaurantPage.css';
import './StarRating.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurant, selectRestaurant } from '../../store/restaurants';
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import FindTableTime from '../FindTableTimeForm';
import UserReview from './UserReview';
import { fetchReviews, selectAllReviews } from '../../store/reviews';

const RestaurantPage = () => {
    const {id} = useParams();
    const dispatch = useDispatch();
    const restaurant = useSelector(selectRestaurant(id));
    const reviews = useSelector(selectAllReviews)
    console.log("reviews", reviews)

    useEffect(() => {
        dispatch(fetchRestaurant(id));
    }, [dispatch, id]);

    useEffect(() => {
        dispatch(fetchReviews())
    }, [dispatch])

    if (!restaurant) {
        return;
    }

    const filteredReviews = Object.values(reviews).filter(
        (review) => parseInt(review.restaurantId, 10) === parseInt(id, 10)
    );
    
    let avgOverallRating = 0;
    let avgFoodRating = 0;
    let avgServiceRating = 0;
    let avgAmbienceRating = 0;
    let avgValueRating = 0;
    
    if (filteredReviews.length > 0) {
        const overallRatings = filteredReviews.map((review) => review.overallRating);
        const foodRatings = filteredReviews.map((review) => review.foodRating);
        const serviceRatings = filteredReviews.map((review) => review.serviceRating);
        const ambienceRatings = filteredReviews.map((review) => review.ambienceRating);
        const valueRatings = filteredReviews.map((review) => review.valueRating);

        const sumOverallRatings = overallRatings.reduce((total, rating) => total + rating, 0);
        const sumFoodRatings = foodRatings.reduce((total, rating) => total + rating, 0);
        const sumServiceRatings = serviceRatings.reduce((total, rating) => total + rating, 0);
        const sumAmbienceRatings = ambienceRatings.reduce((total, rating) => total + rating, 0);
        const sumValueRatings = valueRatings.reduce((total, rating) => total + rating, 0);

        avgOverallRating = sumOverallRatings / overallRatings.length;
        avgFoodRating = sumFoodRatings / foodRatings.length;
        avgServiceRating = sumServiceRatings / serviceRatings.length;
        avgAmbienceRating = sumAmbienceRatings / ambienceRatings.length;
        avgValueRating = sumValueRatings / valueRatings.length;
    }

    
    return (
        <div className="page-container">
            <div className="content">
                <div className="restaurant-banner" style={{ backgroundImage: `url(${restaurant.image})` }}></div>
                <div className="restaurant-container">
                    <div className='restaurant-info'>
                        <div className='restaurant-tabs'>
                            <a href="#overview">
                                Overview
                            </a>
                            <a href="#menu">
                                Menu
                            </a>
                            <a href="#reviews">
                                Reviews
                            </a>
                        </div>
                        <div id='overview'>
                            <h1>{restaurant.name}</h1>
                            <div className='overview-info'>
                                <div className='overview-info-component'>
                                    <div>
                                        {Array.from({ length: 5 }).map((_, index) => (
                                            <span key={index} className={index < avgOverallRating ? 'red-star' : 'grey-star'}>
                                            ★
                                            </span>
                                        ))}
                                    </div>
                                    <div className='info-details'>{avgOverallRating}</div>
                                </div>
                                <div className='overview-info-component'>
                                    <div>
                                        <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M19,4 L5,4 C3.8954305,4 3,4.8954305 3,6 L3,15 C3,16.1045695 3.8954305,17 5,17 L11,17 L15.36,20.63 C15.6583354,20.8784924 16.0735425,20.9318337 16.4250008,20.7668198 C16.776459,20.6018059 17.0006314,20.2482681 17,19.86 L17,17 L19,17 C20.1045695,17 21,16.1045695 21,15 L21,6 C21,4.8954305 20.1045695,4 19,4 Z M19,15 L15,15 L15,17.73 L11.72,15 L5,15 L5,6 L19,6 L19,15 Z" fill="#2D333F" fillRule="nonzero"></path>
                                        </svg>
                                    </div>
                                    <div className='info-details'>{filteredReviews.length} Review{filteredReviews.length === 1 ? "" : "s"}</div>
                                </div>
                                <div className='overview-info-component'>
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            >
                                            <path d="M20,15 L20,9 L18.5,9 C18.2238576,9 18,8.77614237 18,8.5 L18,7 L6,7 L6,8.5 C6,8.77614237 5.77614237,9 5.5,9 L4,9 L4,15 L5.5,15 C5.77614237,15 6,15.2238576 6,15.5 L6,17 L18,17 L18,15.5 C18,15.2238576 18.2238576,15 18.5,15 L20,15 Z M4,5 L20,5 C21.1045695,5 22,5.8954305 22,7 L22,17 C22,18.1045695 21.1045695,19 20,19 L4,19 C2.8954305,19 2,18.1045695 2,17 L2,7 C2,5.8954305 2.8954305,5 4,5 Z M12,10 C13.1045695,10 14,10.8954305 14,12 C14,13.1045695 13.1045695,14 12,14 C10.8954305,14 10,13.1045695 10,12 C10,10.8954305 10.8954305,10 12,10 Z" fill="#2D333F"></path>
                                        </svg>
                                    </div>
                                    <div className='info-details'>{restaurant.price}</div>
                                </div>
                                <div className='overview-info-component'>
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            >
                                            <path d="M11,2 C12.1045695,2 13,2.8954305 13,4 L13,11 C13,12.1045695 12.1045695,13 11,13 L10,13 L10,21 C10,21.5522847 9.55228475,22 9,22 L8,22 C7.44771525,22 7,21.5522847 7,21 L7,13 L6,13 C4.8954305,13 4,12.1045695 4,11 L4,4 C4,2.8954305 4.8954305,2 6,2 L11,2 Z M11,11 L11,4 L10,4 L10,8.5 C10,8.77614237 9.77614237,9 9.5,9 C9.22385763,9 9,8.77614237 9,8.5 L9,4 L8,4 L8,8.5 C8,8.77614237 7.77614237,9 7.5,9 C7.22385763,9 7,8.77614237 7,8.5 L7,4 L6,4 L6,11 L11,11 Z M19.45,2 C19.7537566,2 20,2.24624339 20,2.55 L20,21 C20,21.5522847 19.5522847,22 19,22 L18,22 C17.4477153,22 17,21.5522847 17,21 L17,17 L16,17 C14.8954305,17 14,16.1045695 14,15 L14,7.45 C14,4.44004811 16.4400481,2 19.45,2 Z M16,15 L18,15 L18,4.32 C16.7823465,4.88673047 16.0026709,6.10692278 16,7.45 L16,15 Z" fill="#2D333F" fillRule="nonzero"></path>
                                        </svg>
                                    </div>
                                    <div className='info-details'>{restaurant.cuisine}</div>
                                </div>
                            </div>
                            <div className='restaurant-description'>
                                <p>{restaurant.description}</p>
                            </div>
                        </div>
                        <div id='menu'>
                            <h2>Menu</h2>
                            <p>At present, we do not have menu information for this restaurant. Please see their website or wait to visit the restaurant to learn more.</p>
                            <div id='website-menu'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M19.5,4 C19.7761424,4 20,4.22385763 20,4.5 L20,9.5 C20,9.77614237 19.7761424,10 19.5,10 L18.5,10 C18.2238576,10 18,9.77614237 18,9.5 L18,7.41 L12.18,13.25 C12.0861167,13.3446563 11.9583188,13.3978992 11.825,13.3978992 C11.6916812,13.3978992 11.5638833,13.3446563 11.47,13.25 L10.76,12.54 C10.6653437,12.4461167 10.6121008,12.3183188 10.6121008,12.185 C10.6121008,12.0516812 10.6653437,11.9238833 10.76,11.83 L16.59,6 L14.5,6 C14.2238576,6 14,5.77614237 14,5.5 L14,4.5 C14,4.22385763 14.2238576,4 14.5,4 L19.5,4 Z M19.5,14 C19.7761424,14 20,14.2238576 20,14.5 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,6 C4,4.8954305 4.8954305,4 6,4 L9.5,4 C9.77614237,4 10,4.22385763 10,4.5 L10,5.5 C10,5.77614237 9.77614237,6 9.5,6 L6,6 L6,18 L18,18 L18,14.5 C18,14.2238576 18.2238576,14 18.5,14 L19.5,14 Z" fill="#2D333F" fillRule="nonzero"></path>
                                    </svg>
                                </div>
                                <div>
                                    <a href='https://personalitygrowth.com/wp-content/uploads/2018/12/What-Being-Thorough-Means-to-You-Based-on-Your-Personality-Type-1044x675.jpg' target='_blank' rel='noopener noreferrer'>View menu on restaurant's website</a>
                                </div>
                            </div>
                        </div>
                        <div id='reviews-section-container'>
                            <div>
                                <h2>What {filteredReviews.length} people are saying</h2>
                                <h4>Overall ratings and reviews</h4>
                                <div id='review-summary-container'>
                                    <div>
                                        <p>Reviews can only be made by diners who have eaten at this restaurant</p>
                                        <div id='avg-review-text-container'>
                                            <div>
                                                {Array.from({ length: 5 }).map((_, index) => (
                                                    <span>
                                                    ★
                                                    </span>
                                                ))}
                                            </div>
                                            <p>{filteredReviews.length !== 0 ? filteredReviews.length+" based on recent ratings" : "Restaurant has not been reviewed yet"}</p>
                                        </div>
                                        <div id='individual-rtg-avg'>
                                            <div>
                                                <h4>{avgFoodRating}</h4>
                                                <p>Food</p>
                                            </div>
                                            <div>
                                                <h4>{avgServiceRating}</h4>
                                                <p>Service</p>
                                            </div>
                                            <div>
                                                <h4>{avgAmbienceRating}</h4>
                                                <p>Ambience</p>
                                            </div>
                                            <div>
                                                <h4>{avgValueRating}</h4>
                                                <p>Value</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <li id='meter-list'>
                                            <label for="meter-5" className='meter-label'>5</label>
                                            <meter id="meter-5" className='rating-meter' value="69.64285714285714" min="0" max="100"><div></div></meter>
                                        </li>
                                        <li id='meter-list'>
                                            <label for="meter-4" className='meter-label'>4</label>
                                            <meter id="meter-4" className='rating-meter' value="69.64285714285714" min="0" max="100"><div></div></meter>
                                        </li>
                                        <li id='meter-list'>
                                            <label for="meter-3" className='meter-label'>3</label>
                                            <meter id="meter-3" className='rating-meter' value="69.64285714285714" min="0" max="100"><div></div></meter>
                                        </li>
                                        <li id='meter-list'>
                                            <label for="meter-2" className='meter-label'>2</label>
                                            <meter id="meter-2" className='rating-meter' value="69.64285714285714" min="0" max="100"><div></div></meter>
                                        </li>
                                        <li id='meter-list'>
                                            <label for="meter-1" className='meter-label'>1</label>
                                            <meter id="meter-1" className='rating-meter' value="69.64285714285714" min="0" max="100"><div></div></meter>
                                        </li>
                                    </div>
                                </div>
                                <div id='users-reviews-search-container'>
                                    <div>
                                        <input placeholder='Search all reviews'></input>
                                        <div id='review-num-sort-container'>
                                            <p>{filteredReviews.length} Review{filteredReviews.length === 1 ? "" : "s"}</p>
                                            <button>Sort Dropdown</button>
                                        </div>
                                    </div>
                                    <div id='users-reviews-container'>
                                        {filteredReviews.map((review) => (
                                            <UserReview key={review.id} review={review} />
                                        ))}
                                        {filteredReviews.length === 0 && (
                                            <p>This restaurant doesn't have any views yet. Be the first!</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='restaurant-sidebar'>
                        <div className='reservation-container'>
                            <FindTableTime />
                        </div>
                        <div className='map-container'>
                            {/* <div id='map'></div> */}
                            <div className='address'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M12,2 C16.418278,2 20,5.581722 20,10 C20,12.8133333 17.5666667,16.59 12.7,21.33 C12.3111565,21.7111429 11.6888435,21.7111429 11.3,21.33 C6.43333333,16.59 4,12.8133333 4,10 C4,5.581722 7.581722,2 12,2 Z M12,4 C8.6862915,4 6,6.6862915 6,10 C6,11.21 6.8,14 12,19.21 C17.2,14 18,11.21 18,10 C18,6.6862915 15.3137085,4 12,4 Z M12,7 C13.6568542,7 15,8.34314575 15,10 C15,11.6568542 13.6568542,13 12,13 C10.3431458,13 9,11.6568542 9,10 C9,8.34314575 10.3431458,7 12,7 Z M12,9 C11.4477153,9 11,9.44771525 11,10 C11,10.5522847 11.4477153,11 12,11 C12.5522847,11 13,10.5522847 13,10 C13,9.44771525 12.5522847,9 12,9 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <a href='#'>{restaurant.address}</a>
                            </div>
                        </div>
                        <div className='additional-info'>
                            <h4>Additional information</h4>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M11.0042221,7.00000436 C11.046625,6.34790658 11.405963,5.75411959 11.9710085,5.41509227 L14.9710085,3.61509227 C15.6043733,3.23507341 16.3956267,3.23507341 17.0289915,3.61509227 L20.0289915,5.41509227 C20.6314023,5.77653877 21,6.42755242 21,7.13007812 L21,17.9976974 C21,19.1022669 20.1045695,19.9976974 19,19.9976974 L11.0968245,19.9976974 C11.0647419,19.9992266 11.0324613,20 11,20 L5,20 C3.8954305,20 3,19.1045695 3,18 L3,9 C3,7.8954305 3.8954305,7 5,7 L11,7 C11.0014077,7 11.0028151,7.00000145 11.0042221,7.00000436 Z M11,9 L5,9 L5,18 L11,18 L11,9 Z M13,7 L13,18.0000782 L19,18.0000782 L19,7 L16,5.07741671 L13,7 Z M7.5,11 L8.5,11 C8.77614237,11 9,11.2238576 9,11.5 L9,12.5 C9,12.7761424 8.77614237,13 8.5,13 L7.5,13 C7.22385763,13 7,12.7761424 7,12.5 L7,11.5 C7,11.2238576 7.22385763,11 7.5,11 Z M7.5,14 L8.5,14 C8.77614237,14 9,14.2238576 9,14.5 L9,15.5 C9,15.7761424 8.77614237,16 8.5,16 L7.5,16 C7.22385763,16 7,15.7761424 7,15.5 L7,14.5 C7,14.2238576 7.22385763,14 7.5,14 Z M15.5,11 L16.5,11 C16.7761424,11 17,11.2238576 17,11.5 L17,12.5 C17,12.7761424 16.7761424,13 16.5,13 L15.5,13 C15.2238576,13 15,12.7761424 15,12.5 L15,11.5 C15,11.2238576 15.2238576,11 15.5,11 Z M15.5,14 L16.5,14 C16.7761424,14 17,14.2238576 17,14.5 L17,15.5 C17,15.7761424 16.7761424,16 16.5,16 L15.5,16 C15.2238576,16 15,15.7761424 15,15.5 L15,14.5 C15,14.2238576 15.2238576,14 15.5,14 Z M15.5,8 L16.5,8 C16.7761424,8 17,8.22385763 17,8.5 L17,9.5 C17,9.77614237 16.7761424,10 16.5,10 L15.5,10 C15.2238576,10 15,9.77614237 15,9.5 L15,8.5 C15,8.22385763 15.2238576,8 15.5,8 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Neighborhood</h5>
                                    <p>{restaurant.neighborhood}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
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
                                <div className='info-details'>
                                    <h5>Hours of operation</h5>
                                    <p>{restaurant.hours}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M11,2 C12.1045695,2 13,2.8954305 13,4 L13,11 C13,12.1045695 12.1045695,13 11,13 L10,13 L10,21 C10,21.5522847 9.55228475,22 9,22 L8,22 C7.44771525,22 7,21.5522847 7,21 L7,13 L6,13 C4.8954305,13 4,12.1045695 4,11 L4,4 C4,2.8954305 4.8954305,2 6,2 L11,2 Z M11,11 L11,4 L10,4 L10,8.5 C10,8.77614237 9.77614237,9 9.5,9 C9.22385763,9 9,8.77614237 9,8.5 L9,4 L8,4 L8,8.5 C8,8.77614237 7.77614237,9 7.5,9 C7.22385763,9 7,8.77614237 7,8.5 L7,4 L6,4 L6,11 L11,11 Z M19.45,2 C19.7537566,2 20,2.24624339 20,2.55 L20,21 C20,21.5522847 19.5522847,22 19,22 L18,22 C17.4477153,22 17,21.5522847 17,21 L17,17 L16,17 C14.8954305,17 14,16.1045695 14,15 L14,7.45 C14,4.44004811 16.4400481,2 19.45,2 Z M16,15 L18,15 L18,4.32 C16.7823465,4.88673047 16.0026709,6.10692278 16,7.45 L16,15 Z" fill="#2D333F" fillRule="nonzero"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Cuisines</h5>
                                    <p>{restaurant.cuisine}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M11,20 L11,18 L5,18 C4.44771525,18 4,17.5522847 4,17 L4,16.5 C4,16.2238576 4.22385763,16 4.5,16 L19.5,16 C19.7761424,16 20,16.2238576 20,16.5 L20,17 C20,17.5522847 19.5522847,18 19,18 L13,18 L13,20 L14.5,20 C14.7761424,20 15,20.2238576 15,20.5 L15,21.5 C15,21.7761424 14.7761424,22 14.5,22 L9.5,22 C9.22385763,22 9,21.7761424 9,21.5 L9,20.5 C9,20.2238576 9.22385763,20 9.5,20 L11,20 Z M9.00417359,5.4035781 C9.00139886,5.34650803 9,5.28913741 9,5.23151007 C9,3.44679634 10.3431457,2 12,2 C13.6568543,2 15,3.44679634 15,5.23151007 C15,5.28914395 14.9986008,5.34652105 14.9958255,5.40359753 C18.4009049,6.45156941 20.0249274,9.56291275 19.9997109,15 L4.00029014,14.9999824 C3.97502821,9.56287514 5.5990558,6.45153039 9.00417359,5.4035781 Z M11.0648956,5.03309447 C11.3666212,5.01099572 11.6782939,5 11.9999677,5 C12.3216638,5 12.6333575,5.01099726 12.9351029,5.0330991 C12.9775121,4.90683455 13,4.77109821 13,4.63102852 C13,4.00637872 12.5522848,3.5 12,3.5 C11.4477152,3.5 11,4.00637872 11,4.63102852 C11,4.7710965 11.0224873,4.90683124 11.0648956,5.03309447 Z M17.9997832,13 C18.0235785,8.89548434 16.0892795,7 11.9999758,7 C7.91067197,7 5.97637963,8.89548371 6.00021761,12.9999894 L17.9997832,13 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Dining style</h5>
                                    <p>{restaurant.diningStyle}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M17.58,11.53 C17.4266401,11.1416536 17.3986659,10.7150477 17.5,10.31 L18.68,5.66 C18.9359464,4.6576009 18.3851789,3.62545408 17.41,3.28 L14,2.09 L13.68,3.09 C13.47,3.72 12.89,4.04 11.95,4.04 C11.01,4.04 10.45,3.72 10.24,3.1 L9.92,2.1 L6.59,3.28 C5.61955417,3.62512239 5.06991046,4.65083545 5.32,5.65 L6.49,10.3 C6.59133406,10.7050477 6.5633599,11.1316536 6.41,11.52 L3.08,20 L4.01,20.36 C6.55296711,21.3932302 9.265496,21.9459079 12.01,21.99 C14.7522514,21.9642714 17.4642871,21.4143968 20,20.37 L20.92,20 L17.58,11.53 Z M8.85,4.6 C9.60629927,5.55574661 10.7837814,6.07907199 12,6 C13.2152867,6.07388266 14.3904734,5.55157745 15.15,4.6 L16.74,5.16 L15.56,9.81 C15.56,9.87 15.56,9.93 15.56,10 L8.46,10 C8.46,9.94 8.46,9.88 8.46,9.81 L7.25,5.16 L8.85,4.6 Z M12.05,20 C9.87756989,19.9727298 7.72482585,19.5840868 5.68,18.85 L8.27,12.26 C8.27,12.17 8.32,12.09 8.35,12 L15.63,12 C15.63,12.09 15.63,12.17 15.71,12.26 L18.31,18.86 C16.3022506,19.5891869 14.1859133,19.9745901 12.05,20 Z" fill="#2D333F" fillRule="nonzero"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Dress code</h5>
                                    <p>{restaurant.dressCode}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M12,21 C7.02943725,21 3,16.9705627 3,12 C3,7.02943725 7.02943725,3 12,3 C16.9705627,3 21,7.02943725 21,12 C21,16.9705627 16.9705627,21 12,21 Z M12,19 C15.8659932,19 19,15.8659932 19,12 C19,8.13400675 15.8659932,5 12,5 C8.13400675,5 5,8.13400675 5,12 C5,15.8659932 8.13400675,19 12,19 Z M9.5,7.97771 C9.5,7.85871 9.596,7.74971 9.728,7.74971 L12.546,7.74971 C14.021,7.74971 15.233,8.94871 15.233,10.40071 C15.233,11.88771 14.021,13.09971 12.558,13.09971 L11.059,13.09971 L11.059,15.91771 C11.059,16.03671 10.951,16.14571 10.831,16.14571 L9.728,16.14571 C9.596,16.14571 9.5,16.03671 9.5,15.91771 L9.5,7.97771 Z M12.498,11.63571 C13.17,11.63571 13.685,11.09671 13.685,10.38871 C13.685,9.72971 13.17,9.22571 12.498,9.22571 L11.059,9.22571 L11.059,11.63571 L12.498,11.63571 Z" fill="#2D333F"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Parking details</h5>
                                    <p>{restaurant.parkingDetails}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M19.5,4 C19.7761424,4 20,4.22385763 20,4.5 L20,9.5 C20,9.77614237 19.7761424,10 19.5,10 L18.5,10 C18.2238576,10 18,9.77614237 18,9.5 L18,7.41 L12.18,13.25 C12.0861167,13.3446563 11.9583188,13.3978992 11.825,13.3978992 C11.6916812,13.3978992 11.5638833,13.3446563 11.47,13.25 L10.76,12.54 C10.6653437,12.4461167 10.6121008,12.3183188 10.6121008,12.185 C10.6121008,12.0516812 10.6653437,11.9238833 10.76,11.83 L16.59,6 L14.5,6 C14.2238576,6 14,5.77614237 14,5.5 L14,4.5 C14,4.22385763 14.2238576,4 14.5,4 L19.5,4 Z M19.5,14 C19.7761424,14 20,14.2238576 20,14.5 L20,18 C20,19.1045695 19.1045695,20 18,20 L6,20 C4.8954305,20 4,19.1045695 4,18 L4,6 C4,4.8954305 4.8954305,4 6,4 L9.5,4 C9.77614237,4 10,4.22385763 10,4.5 L10,5.5 C10,5.77614237 9.77614237,6 9.5,6 L6,6 L6,18 L18,18 L18,14.5 C18,14.2238576 18.2238576,14 18.5,14 L19.5,14 Z" fill="#2D333F" fillRule="nonzero"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Website</h5>
                                    <p>{restaurant.website}</p>
                                </div>
                            </div>
                            <div className='additional-info-item'>
                                <div>
                                    <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    >
                                    <path d="M11.1923881,7.19238816 C13.8147448,7.19238816 16.4332749,7.88002892 19.0481719,9.24949945 C20.3663707,9.93987064 21.1923881,11.3049175 21.1923881,12.7929562 L21.1923881,15.1923882 C21.1923881,16.2969577 20.2969576,17.1923882 19.1923881,17.1923882 L15.8386797,17.1923882 C14.9458358,17.1923934 14.1611367,16.600599 13.9157119,15.74215 C13.5311739,14.3971097 13.051748,13.8597684 12.4435462,13.8590555 L12.2445137,13.8590532 C11.9797378,13.8590516 11.9797378,13.8590516 11.1923912,13.8590525 L10.5908984,13.8590535 L9.94238815,13.8590549 C9.36404307,13.8590549 8.89692488,14.3907007 8.48907223,15.7623886 C8.23683842,16.610715 7.45704835,17.1923882 6.57201858,17.1923882 L3.19238815,17.1923882 C2.08781864,17.1923882 1.19238815,16.2969577 1.19238815,15.1923882 L1.19238815,12.7929431 C1.19239394,11.3049036 2.0184157,9.93985867 3.33661714,9.24949272 C5.95150798,7.88002719 8.5700348,7.19238816 11.1923881,7.19238816 Z M3.19238815,12.7929469 L3.19238815,15.1923882 L6.57201858,15.1923839 C7.20290417,13.0705928 8.26739372,11.8590549 9.94238599,11.8590549 L10.5908946,11.8590535 L11.1923885,11.8590525 C11.9797362,11.8590516 11.9797362,11.8590516 12.2445326,11.8590532 L12.4447301,11.8590562 C14.1421938,11.8610438 15.2370999,13.0882166 15.8386738,15.1923882 L19.1923881,15.1923882 L19.1923881,12.7929562 C19.1923881,12.0489367 18.7793784,11.3664115 18.1202811,11.021227 C15.7828612,9.79707646 13.4802133,9.19238816 11.1923881,9.19238816 C8.90456585,9.19238816 6.60192098,9.79707492 4.26450398,11.0212224 C3.60540308,11.3664055 3.19239104,12.0489299 3.19238815,12.7929469 Z" fill="#2D333F" fillRule="nonzero" transform="translate(11.192388, 12.192388) rotate(-135.000000) translate(-11.192388, -12.192388)"></path>
                                    </svg>
                                </div>
                                <div className='info-details'>
                                    <h5>Phone</h5>
                                    <p>{restaurant.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RestaurantPage;