const express = require('express')
const router = express.Router()

// Route: api/posts -> test route to get all posts
// Public
router.get('/', (req, res) => res.send('posts route'))


module.exports = router 