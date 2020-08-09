const express = require('express')
const router = express.Router()
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

module.exports = router 