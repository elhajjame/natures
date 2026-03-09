const mongoose = require('mongoose');
const validator = require('validator')
const { isLowercase } = require('validator');
const { validate } = require('./tourModel');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, ''],
    required: [true, 'please tell your name']
  },

  email: {
    type: String,
    unique: [true, ''],
    required: [true, 'please provide your email'],
    isLowercase: true, // for conversion
    validate: [validator.isEmail, 'please enter a valid email']
  },

  photo: {
    type: String,
  },

  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: [6, 'the password must be more than 6 characters']
  },

  passwordConfirm: {
    type: String,
    require: [true, 'pleas confirm your password']
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;