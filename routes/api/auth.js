const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const {check, validationResult} = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../../models/User')

// @route POST /api/auth
// @desc Authenticates user and returns token
// @access Public
router.post('/', [
    check('email', 'Email is required').isEmail(),
    check('password', 'Password is required').exists()
], (async (req, res) => {
    try{
        
        const {password, email} = req.body
        
        // Check if user exists
        let user = await User.findOne({email})
        if(!user){
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        // Check if password matches email
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            return res.status(400).json({errors: [{msg: 'Invalid Credentials'}]})
        }

        jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 360000},(err, token) => {
            if(err) throw err
            res.json({token})
        })
        
    }catch(err){
        console.error(err.message)
        res.status(500).send('Server error')

    }
}))

module.exports = router