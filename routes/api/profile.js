const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const { check, validationResult } = require('express-validator')

// Route: GET api/profiles -> route to get all profiles 
// Public 
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])

        if (!profiles) {
            return res.status(400).json({ msg: `Cannot find profiles!` })
        }

        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Err`)
    }
})

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

// Route: POST api/profile -> route to create and update a user profile
// Private

router.post('/', [
    auth,
    [
        check('status', 'Status is required!').not().isEmpty(),
        check('skills', 'Skills is required!').not().isEmpty()
    ]
],
    async (req, res) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const {
            company,
            location,
            website,
            bio,
            skills,
            status,
            githubusername,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook
        } = req.body;

        // build profile object 
        const profileFields = {}
        profileFields.user = req.user.id
        if (company) profileFields.company = company
        if (location) profileFields.location = location
        if (website) profileFields.website = website
        if (bio) profileFields.bio = bio
        if (status) profileFields.status = status
        if (githubusername) profileFields.githubusername = githubusername

        if (skills) {
            profileFields.skills = skills.split(',').map((skill) => skill.trim())
        }

        // Build Social Media Object 
        profileFields.social = {}
        if (youtube) profileFields.social.youtube = youtube
        if (twitter) profileFields.social.twitter = twitter
        if (instagram) profileFields.social.instagram = instagram
        if (linkedin) profileFields.social.linkedin = linkedin
        if (facebook) profileFields.facebook = facebook

        try {
            profile = await Profile.findOne({ user: req.user.id })

            if (profile) {
                // Update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true }
                )
                return res.json(profile)
            }

            // Create 
            profile = new Profile(profileFields)
            await profile.save()
            res.json(profile)

        } catch (err) {
            console.error(err.message)
            res.status(500).send(`Server Error`)
        }
    }
)

// Route: GET api/profile/user/:user_id -> route to get profile by User Id
// Public
router.get('/user/:user_id', async (req, res) => {
    try {
        // find the logged in user by ID - also bring in their name and avatar
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if (!profile) {
            return res.status(400).json({ msg: `Profile not found` })
        }

        res.json(profile)

    } catch (err) {
        console.error(err.message)

        if (err.kind == 'ObjectID') {
            return res.status(400).json({ msg: `Profile not found` })
        }

        res.status(500).send(`Server Err`)
    }
})

// Route: DELETE api/profile -> delete profile, user, and posts
// Private 
router.delete('/', auth, async (req, res) => {
    try {
        // Remove Profile
        await Profile.findOneAndRemove({ user: req.user.id })

        // Remove User
        await User.findOneAndRemove({ _id: req.user.id })

        res.json({ msg: `User deleted` })
    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Err`)
    }
})

// Route: PUT api/profile/experience -> add profile experience
// Private 

router.put('/experience', [
    auth,
    [
        check('title', 'Title is required!').not().isEmpty(),
        check('company', 'Company is required!').not().isEmpty(),
        check('from', 'From date is required!').not().isEmpty()
    ]
], async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })
        profile.experience.unshift(newExp)
        await profile.save()

        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Err`)
    }


})

module.exports = router 