// import SET ALERT and REMOVE ALERT - we will dispatch these 
import uuid from 'uuid'
import { SET_ALERT, REMOVE_ALERT } from './types'

export const setAlert = (msg, alertType) => dispatch => {
    // generates a random id for the alert 
    const id = uuid.v4()
    dispatch({
        type: SET_ALERT,
        payload: { msg, alertType, id }
    })
}