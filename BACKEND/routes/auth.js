const express = require('express');
const { verifyPassword, hashPassword } = require('../utils/password_hashing');
const { createAccessToken, verifyAccessToken, authenticateToken } = require('../utils/oauth2');
const User = require('../models/User');
const UserVerification = require('../models/UserVerification');
const router = express.Router();
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Build nodemailer transporter from env
const {
    SMTP_SERVICE,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    EMAIL_USER,
    EMAIL_PASS,
} = process.env;

let transporterOptions;
if (SMTP_HOST) {
    const port = Number(SMTP_PORT) || 465; // default to SMTPS
    const secure = String(SMTP_SECURE || '').toLowerCase() === 'true' || port === 465;
    transporterOptions = {
        host: SMTP_HOST,
        port,
        secure,
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    };
} else {
    transporterOptions = {
        service: SMTP_SERVICE || 'gmail',
        auth: {
            user: EMAIL_USER,
            pass: EMAIL_PASS,
        },
    };
}

const transporter = nodemailer.createTransport(transporterOptions);

transporter.verify((error, success) => {
    if (error) {
        console.error('[Email] Transport verify failed:', error);
        if (
            (SMTP_SERVICE || 'gmail').toLowerCase() === 'gmail' &&
            (error.code === 'EAUTH' || String(error.responseCode) === '535')
        ) {
            console.error(
                '[Email] Gmail rejected the username/password. If this is a personal/Workspace Gmail account, use an App Password (requires 2-Step Verification) and set it as EMAIL_PASS. Less secure app passwords are no longer supported by Google.'
            );
        }
    } else {
        console.log('[Email] Transport is ready.');
    }
});

router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        
        var existingUser = await User.findOne({ email: email });
        
        if (existingUser) {
            const isMatchUser = await verifyPassword(password, existingUser.password);
            if (isMatchUser) {
                const user_id = existingUser._id;
                const token = createAccessToken({user_id});
                return res.json(token, 200, { message: "Login successful" });
            }
            else{
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

        // Generate a unique verification token
        const verificationToken = uuidv4();
        const userVerification = new UserVerification({
            userId: newUser._id,
            token: verificationToken,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000 // 1 hour expiry
        });
        await userVerification.save();

        // Build verification URL (frontend should have a verify endpoint)
        const verificationUrl = `http://localhost:3000/verify/${verificationToken}`;

        // Send email
        await transporter.sendMail({
            from: EMAIL_USER,
            to: newUser.email,
            subject: "Verify your account",
            html: `
                <h2>Welcome, ${firstName}!</h2>
                <p>Thanks for signing up. Please verify your email by clicking the link below:</p>
                <a href="${verificationUrl}">${verificationUrl}</a>
                <p>This link will expire in 1 hour.</p>
            `
        });

        res.status(201).json({ message: "User registered successfully. Please check your email to verify your account." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});


router.get('/auth/verify/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const record = await UserVerification.findOne({ token });

        if (!record) {
            return res.status(400).json({ message: "Invalid or expired verification token" });
        }

        if (record.expiresAt < Date.now()) {
            return res.status(400).json({ message: "Verification link expired" });
        }

        // Mark user as verified
        await User.updateOne(
            { _id: record.userId },
            { $set: { isVerified: true } }
        );

        // Delete verification record
        await UserVerification.deleteOne({ _id: record._id });

        res.status(200).json({ message: "Account verified successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ detail: "Internal server error" });
    }
});



module.exports = router;
