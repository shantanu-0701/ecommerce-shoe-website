require('dotenv').config(); // Load environment variables
const userModel = require('../models/usermodel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const{generateToken}=require("../utils/generateToken");

// Register User
module.exports.registeruser = async (req, res) => {
  const { email, password, fullname } = req.body;

  try {
    let existingUser = await userModel.findOne({ email });
    if (existingUser) {
      req.flash('error', 'You are already registered!');
      return res.status(400).redirect('/');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      email,
      fullname,
      password: hashedPassword
    });

    const token = jwt.sign(
      { email: user.email, userid: user._id },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    res.status(201).cookie('token', token);
    res.send('User created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
};

// Login User
module.exports.loginuser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      req.flash('error', 'Email or password is incorrect.');
      return res.redirect('/');
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      req.flash('error', 'Incorrect password!');
      return res.redirect('/');
    }

    const token = jwt.sign(
      { email: user.email, userid: user._id },
      process.env.JWT_KEY,
      { expiresIn: '1d' }
    );

    res.cookie('token', token);
    res.redirect('/shop');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error: ' + err.message);
  }
};

// Logout User
module.exports.logoutuser = (req, res) => {
  res.clearCookie('token');
  req.flash('success', 'You have been logged out.');
  res.redirect('/');
};
