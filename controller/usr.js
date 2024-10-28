const { users } = require('../models/usr');
let jwt = require('jsonwebtoken');
require('dotenv').config();
let { comparePassword } = require('../utils/comparepswd')
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const signup = async (req, res) => {
    try {
        const email = req.body.email;
        const existingUser = await users.findOne({ email: email });

        if (!existingUser) {
            const newUser = new users(req.body);
            const savedUser = await newUser.save();
            const { password, ...userWithoutPassword } = savedUser._doc;

            return res.status(200).json({
                message: 'You have successfully signed up',
                user: userWithoutPassword,
            });
        } else {
            return res.status(401).json({
                message: 'User already exists',
            });
        }
    } catch (error) {
        console.error('Error during signup:', error);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        console.log(email, "email")

        const user = await users.findOne({ email: email });
        if (user) {
            const result = await comparePassword(password, user.password);
            if (result) {
                const token = jwt.sign({ email: email }, process.env.secKey, { expiresIn: '24h' });

                const { password, ...userWithoutPassword } = user._doc

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    maxAge: 24 * 60 * 60 * 1000,
                    sameSite: 'strict',
                });
                console.log(res.cookie, "cookie")
                return res.status(200).json({
                    message: 'Login successful',
                    user: userWithoutPassword,
                    token

                });
            } else {
                return res.status(401).json({
                    error: 'Invalid username or password',
                });
            }
        } else {
            return res.status(404).json({
                error: 'User not found',
            });
        }
    } catch (error) {
        console.error('Error during login:', error.message);
        return res.status(500).json({
            error: error.message,
        });
    }
};


const userHandler = async (req, res) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User with given email doesn't exist" });
        }

        // Generate OTP
        const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
        const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

        // Save OTP and expiry to the user document
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();


        const transporter = nodemailer.createTransport({
            host: 'mail.blindsandcurtains.ae',
            port: 587,
            secure: false,
            auth: {
                user: `${process.env.ADMIN_MAIL}`,
                pass: `${process.env.ADMIN_PASSWORD}`,
            },
        });

        const mailOptions = {
            from: process.env.MAILER_MAIL,
            to: user.email,
            subject: 'Your OTP Code',
            text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            message: 'OTP sent to your email. Please check your inbox.',
            user: { fullName: user.fullName, email: user.email }
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};
const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        console.log("Email:" + email)
        console.log("otp:" + otp)
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        const user = await users.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User with given email doesn't exist" });
        }
        console.log(user);

        if (user.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        if (user.otpExpiry < Date.now()) {
            return res.status(400).json({ error: "OTP has expired" });
        }

        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        return res.status(200).json({
            message: 'OTP verified successfully. You can now reset your password.',
        });
    } catch (error) {
        return res.status(500).json({
            error: error.message,
        });
    }
};


const passwordReset2 = async (req, res) => {
    try {
        const user = await users.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({
                message: "user with given email doesn't exist"

            });
        }

        user.password = req.body.password;
        await user.save();
        return res.status(200).json({
            message: 'Password is reseted!',
        });
    } catch (error) {

        return res.status(500).json({
            error: error.message,

        });
    }
};

const getuserHandler = async (req, res) => {
    try {
        const email = req.email;
        if (!email) {
            return res.status(400).json({ message: 'Email not found' });
        }

        const admin = await users.findOne({ email });
        if (!admin) {
            return res.status(401).json({ message: 'user not found' });
        }

        const { password, ...userWithoutPassword } = admin._doc;

        console.log(userWithoutPassword, 'userWithoutPassword')
        return res.status(200).json({ messsage: "User found", user: userWithoutPassword });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


const editUserHandler = async (req, res) => {
    try {
        const adminId = req.params.id;
        const { fullName, email, ProfilePhoto } = req.body;
        if (!fullName || !email) return res.status(401).json({ message: "Mondatory fields are required" });


        let existingAdmin = await users.findById(adminId);
        if (!existingAdmin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Update the admin properties
        existingAdmin.fullName = fullName;
        existingAdmin.email = email;
        existingAdmin.ProfilePhoto = ProfilePhoto;

        // Save the updated admin to the database
        const updatedAdmin = await existingAdmin.save();

        res.status(200).json(updatedAdmin);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    signup,
    login,
    passwordReset2,
    userHandler,
    getuserHandler,
    editUserHandler,

    verifyOtp
};