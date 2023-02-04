const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')

const Post = require('../../models/Post')
const User = require('../../models/User')
const Profile = require('../../models/Profile')

// @route POST /api/posts
// @desc Add a new post
// @access Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],(async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
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
        res.status(500).send('Server Error')
    }
}))

// @route GET /api/posts
// @desc Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({date: -1})
        res.json(posts)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/posts/:id
// @desc Get post by ID
// @access Private
router.get('/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.json(post)
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Server Error')
    }
})

// @path DELETE /api/posts/:id
// @desc Deletes post by ID
// @access Private
router.delete('/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({msg: 'Post not found'})
        }
        if(post.user.toString() !== req.user.id){
            return res.status(401).json({mgs: 'User unauthorized'})
        }
        await post.remove()
        res.json({msg: 'Post removed'})
    } catch (err) {
        console.error(err.message)
        if(err.kind === 'ObjectId'){
            return res.status(404).json({msg: 'Post not found'})
        }
        res.status(500).send('Error Message')
    }
})

// @path PUT /api/posts/like/:id
// @desc Like a post
// @access Private
router.put('/like/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)

        // Check if user already liked the post
        if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
            return res.status(400).json({msg: 'Post already liked'})
        }

        post.likes.unshift({user: req.user.id})
        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @path PUT /api/posts/unlike/:id
// @desc Remove like from a post
// @access Private
router.put('/unlike/:id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        
        if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
            return res.status(400).json({msg: 'Post has not been liked yet'})
        }

        post.likes = post.likes.filter(like => like.user.toString() !== req.user.id)
        await post.save()
        res.json(post.likes)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')        
    }
})

// @oath POST /api/posts/comment/:id
// @desc Add a comment
// @access Private
router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    try {
        const post = await Post.findById(req.params.id)
        const user = await User.findById(req.user.id).select('-password')
        const comment = {
            user: req.user.id,
            text: req.body.text,
            name: user.name,
            avatar: user.avatar,
        }

        post.comments.unshift(comment)
        await post.save()
        res.json(post.comments)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route DELETE /api/posts/comment/:id/:comment_id
// @desc Remove a comment
// @access Private
router.delete('/comment/:id/:comment_id', auth, async(req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        const comment = post.comments.find(comment => comment.id === req.params.comment_id)

        // Check if comment exists
        if(!comment){
            return res.status(404).json({msg: 'Comment does not exist'})
        }

        // Check if logged in user is the author of the comment
        if(comment.user.toString() !== req.user.id){
            return res.status(401).json({msg: 'User unathorized'})
        }

        const commentIndex = post.comments.map(comment => comment.id.toString()).indexOf(req.params.comment_id)
        post.comments.splice(commentIndex, 1)
        await post.save()
        res.json(post.comments)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router