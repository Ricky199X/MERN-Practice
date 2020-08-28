// import SET ALERT and REMOVE ALERT - we will dispatch these 
import { v4 as uuid } from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType) => dispatch => {
    // generates a random id for the alert 
    const id = uuid()
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })

    // after 5 second, remove the alert via dispatch
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), 5000)
}