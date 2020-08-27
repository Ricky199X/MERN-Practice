import React, { Fragment, useState } from 'react'
// import { Link } from 'react';

const Login = () => {
    // formData is the state, setFormData is function used to update state
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    // onChange funtion -> handles changes to any input field
    // checks the event target (the name of the field), then changes the value in the field to whatever user enters
    const onChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value })

    // onSubmit -> handles submission of the form 
    const onSubmit = async event => {
        event.preventDefault()
        console.log(`Success!`)
    }

    // Destructure the form data to have easier access to its values
    const { email, password } = formData

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={event => onSubmit(event)}>
                <div className="form-group">
                    <input type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={event => onChange(event)}
                    />
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
                <input type="submit" className="btn btn-primary" value="Sign In" />
            </form>
            {/* <p className="my-1">
                Already have an account? <Link to='/login'>Sign In</Link>
            </p> */}
        </Fragment>
    )
}

export default Login