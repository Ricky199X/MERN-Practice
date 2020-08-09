// middleware to send the token back to authenticate + access protected routes

const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
    // Get the token from the header of a request - token is available in the req's header key
    const token = req.header('x-auth-token')

    // Check if no token 
    if (!token) {
        return res.status(401).json({ message: "No Token, authorization denied" })
    }

    // Verify the Token if there is one - take request obj and assign value to user
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' })
    }
}