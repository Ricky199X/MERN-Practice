const express = require('express')
const router = express.Router()

// Route: api/profile -> test route to get all profiles
// Public
router.get('/', (req, res) => res.send('profile route'))


module.exports = router 