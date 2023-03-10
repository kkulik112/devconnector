const express = require('express')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const auth = require('../../middleware/auth')
const request = require('request')
const config = require('config')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

// @route GET /api/profile/me
// @desc Get current user profile
// @access Private
router.get('/me', auth,(async (req, res) => {
    try{
        // Find a user in Profile model based on user ref
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar'])
        if(!profile){
            return res.status(400).json({msg: 'There is no profile for this user'})
        }

        res.json(profile)
    } catch(err) {
        console.err(err.message)
        res.status(500).send('Server error')
    }
}))

// @route POST /api/profile
// @desc Creates or updates a profile
// @access Private

router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body

    // Build profile object
    const profileFields = {}
    profileFields.user = req.user.id
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    profileFields.bio = bio ? bio : ''
    if(status) profileFields.status = status
    if(githubusername) profileFields.githubusername = githubusername
    if(skills) {
        profileFields.skills = skills.toString().split(',').map(skill => skill.trim())
    }
    // Build social object
    profileFields.social = {}
    if(youtube) profileFields.social.youtube = youtube
    if(facebook) profileFields.social.facebook = facebook
    if(twitter) profileFields.social.twitter = twitter
    if(instagram) profileFields.social.instagram = instagram
    if(linkedin) profileFields.social.linkedin = linkedin

    try{
        let profile = await Profile.findOne({user: req.user.id})
        if(profile){
            // Update
            profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
            return res.json(profile)
        }

        // Create
        profile = new Profile(profileFields)
        await profile.save()
        return res.json(profile)
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/profile
// @desc Returns all user profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar'])
        res.json(profiles)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/profile/user/:user_id
// @desc Returns profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar'])
        if(!profile) return res.status(400).json({msg: 'Profile not found'})
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        // Check error type to handle invalid user_id
        if(err.kind == 'ObjectId') return res.status(400).json({msg: 'Profile not found'})
        res.status(500).send('Server Error')
    }
})

// @route DELETE /api/profile
// @desc Deletes user, profile and posts
// @access Private
router.delete('/', auth, async (req, res) => {
    try {
        // Remove user posts
        await Post.deleteMany({user: req.user.id})
        // Delete profile
        await Profile.findOneAndRemove({user: req.user.id})
        // Delete user
        await User.findOneAndRemove({_id: req.user.id})

        res.json({msg: 'User deleted'})
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route PUT /api/profile/experience
// @desc Adds experience to a profile
// @access Private
router.put('/experience', [auth, [
    check('title', 'Title is required').not().isEmpty(),
    check('company', 'Company is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.experience.unshift(newExp)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route DELETE /api/profile/experience/:exp_id
// @desc Deletes experience from a profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id})

        profile.experience = profile.experience.filter(exp => exp.id !== req.params.exp_id)
        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route PUT /api/profile/education
// @desc Adds education to a profile
// @access Private
router.put('/education', [auth, [
    check('school', 'School is required').not().isEmpty(),
    check('degree', 'Degree is required').not().isEmpty(),
    check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
    check('from', 'From date is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    } = req.body

    const newEdu = {
        school,
        degree,
        fieldOfStudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({user: req.user.id})
        profile.education.unshift(newEdu)
        await profile.save()
        res.json(profile)
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route DELETE /api/profile/education/:edu_id
// @desc Deletes education from a profile
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id})

        profile.education = profile.education.filter(edu => edu.id !== req.params.edu_id)
        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }
})

// @route GET /api/profile/github/:username
// @ desc Get user repos from github
// @access Public
router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: {'user-agent': 'node.js'}
        }

        request(options, (error, response, body) => {
            if(error) console.error(error)

            if(response.statusCode !== 200){
                return res.status(404).json({msg: 'Github profile not found'})
            }

            res.json(JSON.parse(body))
        })
    } catch (err) {
        console.log(err.message)
        res.status(500).send('Server Error')
    }
})

module.exports = router