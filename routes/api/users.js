const express = require('express')
const router = express.Router()
const gravatar = require('gravatar')
const bcrypt = require('bcryptjs')
const { check, validationResult } = require('express-validator')

// import the User model
const User = require('../../models/User')

// Route: POST api/users -> register user
// Public
router.post('/', [
    check('name', 'name is required')
        .not()
        .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters')
        .isLength({ min: 6 })
],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { name, email, password } = req.body

        try {
            // See if user exists, if the user exists - we send back an error 
            let user = await User.findOne({ email })

            if (user) {
                return res.status(400).json({ errors: [{ msg: "user already exists" }] })
            }

            // get user's gravatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "mm"
            })

            user = new User({
                name,
                email,
                avatar,
                password
            })

            // encrypt the password using bcrypt 
            const salt = await bcrypt.genSalt(10)
            user.password = await bcrypt.hash(password, salt)

            await user.save()

            // return the JSON Web Token - in order to log the user in right away, we need their web token
            res.send('user registered')

        } catch (err) {
            console.log(err.message)
            res.status(500).send('server error')
        }
    })




module.exports = router 