const { users } = require('../models/usr');
let jwt = require('jsonwebtoken');
require('dotenv').config();
let { comparePassword } = require('../utils/comparepswd')

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
                    message: 'Invalid username or password',
                });
            }
        } else {
            return res.status(404).json({
                message: 'User not found',
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
        const email = req.body.email

        if (!email) return res.status(400).json({
            error: "email is required"
        });
        const user = await users.findOne({ email: email });
        if (!user) {
            return res.status(400).json({
                error: "user with given email doesn't exist"

            });

        }
        await user.save();
        return res.status(200).json({
            message: 'user found',
            user
        });
    } catch (error) {
        return res.status(400).json({
            error: error.message,

        });
    }
}

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
  

module.exports = {
    signup,
    login,
    passwordReset2,
    userHandler,
    getuserHandler

};