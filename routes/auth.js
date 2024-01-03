const express = require('express');
const bcrypt = require('bcrypt')
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const dotenv = require("dotenv").config();
const verifyToken = require("../middleware/authMidlleware");
const secret = process.env.JWT_SECRET
const algorithm = 'sha256';
// generate access token
const generateAccessToken = (user) => {
    return jwt.sign({id: user._id}, secret, {expiresIn: '1h'}, {algorithm});
}

//login
router.route('/login').post(async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}); // check if email exists or not
        if (!user) return res.status(404).json({message: 'Invalid Credentials'});
        // compare password with hashed password  in db
        const pwMatch = await bcrypt.compare(password, user.get('password'));
        if (!pwMatch) return res.status(400).json({message: 'Invalid Credentials'});
        // create token
        const token = generateAccessToken(user);
        res.status(200).json({
            message: "User logged in successfully",
            status: "success",
            timestamps: Date.now(),
            token:"Bearer, "+token
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

// get me
router.route('/me').get(verifyToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.userId});
        if (!user) return res.status(404).json({message: 'User not found'});
        res.status(200).json({
            message: "User retrieved successfully",
            status: "success",
            timestamps: Date.now(),
            data: user
        });
    } catch (err) {
        res.status(500).json({message: err.message});
    }
})

module.exports = router;