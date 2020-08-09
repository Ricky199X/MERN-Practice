const express = require('express')
const router = express.Router()

// Route: api/auth -> test auth route
// Public
router.get('/', (req, res) => res.send('auth route'))


module.exports = router 