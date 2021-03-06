// Since Register is a functional companent, we want to use useState hook 
import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom';
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'

// connect component to Redux 
import { connect } from 'react-redux'

const Register = ({ setAlert, register }) => {
    // formData is the state, setFormData is function used to update state
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    // onChange funtion -> handles changes to any input field
    // checks the event target (the name of the field), then changes the value in the field to whatever user enters
    const onChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value })

    // onSubmit -> handles submission of the form 
    const onSubmit = async event => {
        event.preventDefault()

        if (password !== password2) {
            setAlert(`Passwords do not match`, 'danger')
        } else {
            register({ name, email, password })
        }
    }

    // Destructure the form data to have easier access to its values
    const { name, email, password, password2 } = formData

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" onSubmit={event => onSubmit(event)}>
                <div className="form-group">
                    <input type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={event => onChange(event)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={event => onChange(event)}
                    />
                    <small className="form-text"
                    >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
                    >
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={event => onChange(event)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                        value={password2}
                        onChange={event => onChange(event)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to='/login'>Sign In</Link>
            </p>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
}

export default connect(null, { setAlert, register })(Register)