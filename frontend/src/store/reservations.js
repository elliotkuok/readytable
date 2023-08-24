import csrfFetch from "./csrf";

//CONSTANTS
export const RECEIVE_RESERVATIONS = "RECEIVE_RESERVATIONS";
export const RECEIVE_RESERVATION = "RECEIVE_RESERVATION";
export const REMOVE_RESERVATION = "REMOVE_RESERVATION";
export const CREATE_RESERVATION = "CREATE_RESERVATION";
export const UPDATE_RESERVATION = "UPDATE_RESERVATION";
export const DELETE_RESERVATION = "DELETE_RESERVATION";
export const STORE_USER = "STORE_USER";
export const SET_SELECTED_TIME = 'SET_SELECTED_TIME';
export const SET_SELECTED_DATE = 'reservations/SET_SELECTED_DATE';
export const SET_SELECTED_SIZE = 'reservations/SET_SELECTED_SIZE';

// ACTION CREATORS
export const receiveReservations = reservations => ({
    type: RECEIVE_RESERVATIONS,
    payload: reservations
})

export const receiveReservation = reservation => ({
    type: RECEIVE_RESERVATION,
    payload: reservation
})

export const createReservation = reservation => ({
    type: CREATE_RESERVATION,
    payload: reservation
});

export const updateReservation = reservation => ({
    type: UPDATE_RESERVATION,
    payload: reservation
});

export const deleteReservation = id => ({
    type: DELETE_RESERVATION,
    payload: id
});

export const storeUser = user => ({
    type: STORE_USER,
    payload: user
});

export const setSelectedTime = (time) => {
    return {
        type: SET_SELECTED_TIME,
        payload: time,
    };
};

export const setSelectedDate = (date) => ({
    type: SET_SELECTED_DATE,
    payload: date,
});

export const setSelectedSize = (size) => ({
    type: SET_SELECTED_SIZE,
    payload: size,
});



// THUNK ACTION CREATORS
export const fetchReservations = () => async (dispatch) => {
    const res = await csrfFetch(`/api/reservations`);
    if (res.ok) {
        const reservations = await res.json();
        dispatch(receiveReservations(reservations));
    }
}

export const fetchReservation = id => async (dispatch) => {
    const res = await csrfFetch(`/api/reservations/${id}`);
    if (res.ok) {
        const reservation = await res.json();
        dispatch(receiveReservation(reservation));
    }
}

export const postReservation = reservation => async dispatch => {
    const res = await csrfFetch(`/api/reservations`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reservation)
    });

    if (res.ok) {
        const newReservation = await res.json();
        dispatch(createReservation(newReservation));
    }
}

export const patchReservation = reservation => async dispatch => {
    const res = await csrfFetch(`/api/reservations/${reservation.id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(reservation)
    });

    if (res.ok) {
        const updatedReservation = await res.json();
        dispatch(updateReservation(updatedReservation));
    }
}

export const destroyReservation = id => async dispatch => {
    const res = await csrfFetch(`/api/reservations/${id}`, {
        method: 'DELETE',
    });

    if (res.ok) {
        dispatch(deleteReservation(id));
    }
}

export const fetchUser = id => async dispatch => {
    const res = await csrfFetch(`/api/users/${id}`);
    if (res.ok) {
      const user = await res.json();
      dispatch(storeUser(user));
    }
};

// SELECTORS
export const selectAllReservations = state => state.reservations

export const selectReservation = function(id) {
    return function(state) {
      return Object.values(state.reservations.reservations).find(r => r.id.toString() === id)
    }
}


// REDUCER
const initialState = {
    selectedTime: null,
    selectedDate: null,
    selectedSize: null,
    reservations: {},
};

const reservationsReducer = (state = initialState, action) => {
    const nextState = {...state};

    switch (action.type) {
        case SET_SELECTED_SIZE:
            return {
                ...state,
                selectedSize: action.payload, // Update selected time in state
            };
        case SET_SELECTED_TIME:
            return {
                ...state,
                selectedTime: action.payload, // Update selected time in state
            };
        case SET_SELECTED_DATE:
            return {
                ...state,
                selectedDate: action.payload,
            };
        case STORE_USER:
            nextState[action.payload.id] = action.payload;
            return nextState;
        case RECEIVE_RESERVATION:
            nextState.reservations[action.payload.reservation.id] = action.payload.reservation;
            return nextState;
        case RECEIVE_RESERVATIONS:
            return Object.assign(nextState, action.payload);
        case CREATE_RESERVATION:
            nextState[action.payload.id] = action.payload;
            return nextState;
        case UPDATE_RESERVATION:
            nextState[action.payload.id] = action.payload;
            return nextState;
        case DELETE_RESERVATION:
            delete nextState[action.payload];
            return nextState;
        default:
            return state;
    }
}

export default reservationsReducer;