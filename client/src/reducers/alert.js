// alert reducer
// function that takes in a piece of state (alerts)
// also takes in an action
import { SET_ALERT, REMOVE_ALERT } from '../actions/types'

const initialState = []

export default function (state = initialState, action) {
    const { type, payload } = action
    // evaluate the type with a switch statement
    // return the state and the action's data (payload)
    switch (type) {
        case SET_ALERT:
            return [...state, payload]
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload)
        default:
            return state
    }
}

