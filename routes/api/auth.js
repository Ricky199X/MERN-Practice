const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

const auth = require('../../middleware/auth')
const User = require('../../models/User')

// Route: api/auth -> test auth route
// Public
router.get('/', auth, async (req, res) => {
    try {
        // in our middle ware, we set the user to the user in the token, so we can access the user obj
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})


// Route: POST api/auth -> Authenticate user + get token
// Public
router.post('/',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Passowrd is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { email, password } = req.body

        try {
            // See if user exists, if the user exists - we send back an error 
            let user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
            }

            // check if the password is a match - if not, send message that says invalid credentials
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] })
            }

            // return the JSON Web Token - in order to log the user in right away, we need their web token
            const payload = {
                user: {
                    id: user.id
                }
            }

            // sign the token, pass in payload, pass in secret + expiration
            // inside callback we'll get an error or token - if we get token we send it back to client
            jwt.sign(
                payload,
                config.get('jwtSecret'),
                { expiresIn: 3600000 },
                (err, token) => {
                    if (err) throw err
                    res.json({ token })
                }
            )

        } catch (err) {
            console.log(err.message)
            res.status(500).send('server error')
        }
    })

module.exports = router 