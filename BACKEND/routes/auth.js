const express = require('express');
const { verifyPassword, hashPassword } = require('../utils/password_hashing');
const { createAccessToken, verifyAccessToken, authenticateToken } = require('../utils/oauth2');
const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const router = express.Router();


router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {

        var existingUser = await User.findOne({ email: email });

        if (existingUser) {
            const isMatchUser = await verifyPassword(password, existingUser.password);
            if (isMatchUser) {
                const user_id = existingUser._id;
                const token = createAccessToken({ user_id });
                return res.status(200).json({
                    token: token,
                    message: "Login successful"
                });
            }
            else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        }
        res.status(401).json({ message: "Invalid credentials" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});

router.post('/auth/register', async (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Create new user (unverified by default)
        const newUser = new User({
            email,
            password: hashedPassword,
            firstName,
            lastName,
            isVerified: false   // add this field in your User model
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});




module.exports = router;
