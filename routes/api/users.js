const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')

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
    (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }
        console.log(req.body)
        res.send(req.body)
    })


module.exports = router 