const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: [true, ''],
    required: [true, 'please tell your name']
  },

  email: {
    type: String,
    unique: [true, 'the email must be unique'],
    required: [true, 'please provide your email'],
    isLowercase: true, // for conversion
    validate: [validator.isEmail, 'please enter a valid email']
  },

  photo: {
    type: String,
  },

  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },

  password: {
    type: String,
    required: [true, 'please provide a password'],
    minlength: [6, 'the password must be more than 6 characters'],
    select: false
  },

  passwordConfirm: {
    type: String,
    require: [true, 'pleas confirm your password'],
    validate: {
      // this works only on SAVE and CREATE
      validator: function (val) {
        return val === this.password
      },
      message: 'passwords are not the same!'
    }
  },

  passwordChangedAt: Date
});

userSchema.pre('save', async function (next) {
  //if the password has not been modified, return don't run this function and move to the next middleware
  if (!this.isModified('password')) return next();
  // the current password + the cost which is 12
  // and its generate the salt random string
  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
});

// instance method: is a method is gonna be available on all documents on a cretan collection
userSchema.methods.correctPassword = async function (
  //the pass that user provide
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
}

// check if the user changed his password
//JWTTimestamp: when the last time the password changed
userSchema.methods.changedPassword = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    console.log(this.passwordChangedAt, JWTTimestamp);
  }
  // means by default the user has not changed his password
  return false
}

const User = mongoose.model('User', userSchema);
module.exports = User;