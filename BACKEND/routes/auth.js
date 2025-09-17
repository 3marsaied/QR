const express = require('express');
const { verifyPassword, hashPassword } = require('../utils/password_hashing');
const { createAccessToken, verifyAccessToken, authenticateToken } = require('../utils/oauth2');
const User = require('../models/User');
const router = express.Router();
const nodemailer = require('nodemailer');
const PasswordReset = require('../models/PasswordReset');




const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



router.post('/login', async (req, res) => {
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

router.post('/register', async (req, res) => {
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


// Step 1: Request OTP
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP in DB with expiry (10 min)
    const reset = new PasswordReset({
      userId: user._id,
      otp,
      expiresAt: Date.now() + 60 * 1000
    });
    await reset.save();

    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      html: `<p>Your OTP is <b>${otp}</b>. It will expire in a minute.</p>`
    });

    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Step 2: Verify OTP and reset password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const record = await PasswordReset.findOne({ userId: user._id, otp });
    if (!record) return res.status(400).json({ message: "Invalid OTP" });
    if (record.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    if (await PasswordReset.findOne({ userId: user._id }).expiresAt > Date.now()) {
        res.status(400).json({ message: "OTP already Expired" });
    }
    // Hash new password
    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();

    // Remove OTP record
    await PasswordReset.deleteOne({ _id: record._id });

    res.status(200).json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.get('/me', authenticateToken, async (req, res) => {
    try {
        const userId = verifyAccessToken(req.token);
        if (!userId) {
            return res.status(401).json({ detail: "Unauthorized" });
        }
        const user = await User.findById({ _id: userId }).select("-password -__v -_id -createdAt");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ user });
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: "Invalid token" });
    }
});


module.exports = router;
