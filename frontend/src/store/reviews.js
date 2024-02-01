import csrfFetch from "./csrf";

//CONSTANTS
export const RECEIVE_REVIEW = "RECEIVE_REVIEW";
export const RECEIVE_REVIEWS = "RECEIVE_REVIEWS";
export const CREATE_REVIEW = "RECEIVE_REVIEW";
export const UPDATE_REVIEW = "UPDATE_REVIEW";
export const DELETE_REVIEW = "DELETE_REVIEW";

// ACTION CREATORS
export const receiveReview = review => ({
    type: RECEIVE_REVIEW,
    payload: review
})
  
  export const receiveReviews = reviews => ({
    type: RECEIVE_REVIEWS,
    payload: reviews
})

export const createReview = review => ({
    type: CREATE_REVIEW,
    payload: review
});

export const updateReview = review => ({
    type: UPDATE_REVIEW,
    payload: review
});

export const deleteReview = id => ({
    type: DELETE_REVIEW,
    payload: id
});

// THUNK ACTION CREATORS
export const fetchReviews = () => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews`);
    if (res.ok) {
        const reviews = await res.json();
        dispatch(receiveReviews(reviews));
    }
}

export const fetchReview = id => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${id}`);
    if (res.ok) {
        const review = await res.json();
        dispatch(receiveReview(review));
    }
}

export const postReview = (review, reservationId) => async dispatch => {
    try {
        const res = await csrfFetch(`/api/reservations/${reservationId}/reviews`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(review)
        })

    if (!res.ok) {
        throw new Error('Failed to create review');
    }
    const newReview = await res.json();
    dispatch(createReview(newReview));
    return newReview;

    } catch (error) {
        console.error('Error in postReview:', error);
        throw error;
    }
}

export const patchReview = (review, reservationId) => async dispatch => {
    const res = await csrfFetch(`/api/reservations/${reservationId}/reviews`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(review)
    });

    if (res.ok) {
        const updatedReview = await res.json();
        return dispatch(updateReview(updatedReview));
    }
}

export const destroyReview = reviewId => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        dispatch(deleteReview(reviewId));
    }
}

// SELECTORS
export const selectAllReviews = state => state.reviews

export const selectReview = function(id) {
    return function(state) {
        return state.reviews[id]
    //   return Object.values(state.reviews).find(r => r.id.toString() === id)
    }
}

// REDUCER
const reviewsReducer = (state = {}, action) => {
    const nextState = {...state};

    switch (action.type) {
        case RECEIVE_REVIEW:
            nextState[action.payload.review.id] = action.payload.review;
            return nextState;
        case RECEIVE_REVIEWS:
            return Object.assign(nextState, action.payload);
        case CREATE_REVIEW:
            nextState[action.payload.id] = action.payload;
            return nextState;
        case UPDATE_REVIEW:
            nextState[action.payload.id] = action.payload;
            return nextState;
        case DELETE_REVIEW:
            delete nextState[action.payload];
            return nextState;
        default:
            return state;
    }
}

export default reviewsReducer;