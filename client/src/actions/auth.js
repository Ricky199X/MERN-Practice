import axios from 'axios'
import { setAlert } from './alert'
import { REGISTER_SUCCESS, REGISTER_FAIL } from './types'

// Register User

export const register = ({ name, email, password }) => async dispatch => {
    // config contains headers because we're sending data
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    // convert the name, email, and passwords to a string 
    const body = JSON.stringify({ name, email, password })

    try {
        // variable for the response -> 
        // takes in the api endpoint, the body of the post request, and the config
        const res = await axios.post('api/users', body, config)

        // if we don't get an error, dispatch register_success
        // we receive back the auth token, which is located in res.data
        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        })
    } catch (err) {
        // if there are errors, locate the array of errors messages
        const errors = err.response.data.errors

        if (errors) {
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }

        // if registration fails, we dispatch register_fail (removes token from local storage, sets token to null)
        dispatch({
            type: REGISTER_FAIL
        })


    }
}