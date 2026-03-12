const jwt = require('jsonwebtoken')
const User = require('./../models/userModel');
const appError = require('./../utils/appError');

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRED_IN
  });
};

exports.signup = async (req, res, next) => {
  try {
    // const newUser = await User.create(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser
      }
    });

  } catch (error) {
    console.log(error)
    res.status(404).json({
      status: 'fail',
      message: error,

    })
  }
}

exports.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    // 1) check if the email and the password exist
    if (!email || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'please provide email and password'
      })
    };
    //2) check if the user exist && password is correct
    // -- if the user is does not exist here the correct function will not run
    const user = await User.findOne({ email }).select('+password');
    // this is async function correctPassword so we need to await
    const correct = await user.correctPassword(password, user.password);

    if (!user || !correct) {
      return res.status(401).json({
        status: 'fail',
        message: 'Incorrect email or password'
      })
    }
    //3) if everting is ok send token to the client
    const token = signToken(user._id);
    res.status(200).json({
      status: 'success',
      token
    });

  } catch (error) {
    console.log(error);
    res.status(404).json({
      status: 'fail',
      message: error
    })
  }
}