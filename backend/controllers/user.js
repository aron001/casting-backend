const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const User = require('../models/user')
const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");

const asyncHandler = require('express-async-handler')
// @desc    Register new user
// @route   POST /api/users
// @access  Public


const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, password } = req.body

  if (!fullname || !email || !password) {
    res.status(400)
    throw new Error('Please add all fields')
  }

  // Check if user exists
  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  // Create user
  const user = await User.create({
    fullname,
    email,
    password: hashedPassword,
  })

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.fullname,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide the all fields!", 400));
  }
  // Check for user email

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("User doesn't exists!", 400));
  }

  if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
          _id: user.id,

          email: user.email,
          fullname: user.fullname,
         
          token: generateToken(user._id),
      });
  } else {
      res.status(400);
      throw new Error("Invalid credentials");
  }
});

//fetch  all users
const fetchallUsers = asyncHandler(async (req, res) => {
  User.find()
  .then((result)=>{
      res.status(200).json(result);
  })
  .catch((error)=>{
      res.status(500).json(error)    
})
});




// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, "abcd123", {
    expiresIn: '3d',
  })
}


module.exports = {
  registerUser,
  loginUser,
  fetchallUsers,

}