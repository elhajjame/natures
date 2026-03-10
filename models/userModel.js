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
    require: [true, 'pleas confirm your password'],
    validate: {
      // this works only on SAVE and CREATE
      validator: function (val) {
        return val === this.password
      },
      message: 'passwords are not the same!'
    }
  }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12)

  this.passwordConfirm = undefined
})

const User = mongoose.model('User', userSchema);
module.exports = User;