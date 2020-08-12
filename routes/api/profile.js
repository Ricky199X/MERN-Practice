const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// Route: GET api/profile/me -> route to get current user's profile - user ID need to be in the token
// Private
router.get('/me', auth, async (req, res) => {
    try {
        // find the logged in user by ID - also bring in their name and avatar
        const profile = await Profile.findOne({ user: req.user.id }).populate('user',
            ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: `That user does not exist!` })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Err`)
    }
})




module.exports = router 