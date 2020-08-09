const express = require('express')
const router = express.Router()

// Route: api/users -> test route to get all users
// Public
router.get('/', (req, res) => res.send('user route'))


module.exports = router 