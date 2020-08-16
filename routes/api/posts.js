const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')

const Post = require('../../models/Post')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// Route: GET api/posts -> test route to get all posts
// Private
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ date: -1 })

        if (!posts) {
            return res.status(400).json({ msg: `Cannot find posts!` })
        }

        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Error`)
    }
})

// Route: POST api/posts -> route to add a post
// Private

router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')

        const newPost = new Post({
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        })

        const post = await newPost.save()
        res.json(post)

    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Error`)
    }

})

// Route: GET api/posts/:id -> route to get post by id
// Private
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: `Post not found!` })
        }

        res.json(post)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: `Post not found!` })
        }

        res.status(500).send(`Server Error`)
    }
})

// Route: DELETE api/posts/:id -> route to delete post by id
// Private

router.delete('/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ msg: `Post not found!` })
        }

        // find the user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: `user not authorized` })
        }

        await post.remove()
        res.json({ msg: `Post removed` })

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: `Post not found!` })
        }

        res.status(500).send(`Server Error`)
    }
})

// Route: PUT api/posts/like/:id -> route to add a like to a post
// Private

router.put('/like/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: `Post already liked!` })
        }

        post.likes.unshift({ user: req.user.id })

        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: `Post not found!` })
        }

        res.status(500).send(`Server Error`)
    }
})

// Route: PUT api/posts/unlike/:id -> route to remove a like to a post
// Private

router.put('/unlike/:id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        // check if the post has already been unliked
        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: `Post has not yet been liked!` })
        }

        // get the remove index
        const removeIndex = post.likes.map((like) => like.user.toString()).indexOf(req.user.id)

        post.likes.splice(removeIndex, 1)

        await post.save()
        res.json(post.likes)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: `Post not found!` })
        }

        res.status(500).send(`Server Error`)
    }
})

// Route: POST api/posts/comment/:id -> route to add a comment to a post
// Private

router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()]
], async (req, res) => {

    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const user = await User.findById(req.user.id).select('-password')
        const post = await Post.findById(req.params.id)

        const newComment = {
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
            user: req.user.id
        }

        post.comments.unshift(newComment)
        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.error(err.message)
        res.status(500).send(`Server Error`)
    }

})

// Route: PUT api/posts/comment/:id/:comment_id -> route to delete a comment
// Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        // get the comment from the post
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // Make sure comment exists
        if (!comment) {
            return res.status(404).json({ msg: `Comment does not exist!` })
        }

        // Check user 
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: `user not authorized` })
        }

        // get the remove index
        const removeIndex = post.comments.map((comment) => comment.user.toString()).indexOf(req.user.id)

        post.comments.splice(removeIndex, 1)

        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.error(err.message)

        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: `Post not found!` })
        }

        res.status(500).send(`Server Error`)
    }
})

module.exports = router 