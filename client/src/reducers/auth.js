// auth reducer

import {
    REGISTER_SUCCESS,
    REGISTER_FAIL
} from '../actions/types'

const initialState = {
    // storing token in local storage 
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null
}


export default function (state = initialState, action) {
    const { type, payload } = action

    switch (type) {
        // if register is success, we get token back and set the user right away
        case REGISTER_SUCCESS:
            localStorage.setItem('token', payload.token)
            return {
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case REGISTER_FAIL:
            localStorage.removeItem('token')
            return {
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }
}

// register a user 