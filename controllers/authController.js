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
      role: req.body.role,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm
    });

    const token = signToken(newUser._id);
    console.log('signup: ', token);
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
    console.log('login: ', token);

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

exports.protect = async (req, res, next) => {
  let token, decoded;

  //1) getting token and check if its there (read the token from the header)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'you are not logged in! please log-in to get access '
    });
  }
  // 2) verification token
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
    // console.log(decoded);
  } catch (err) {
    return res.status(401).json({
      status: 'fail',
      message: 'invalid token please log-in again'
    })
  }
  // 3) check if user still exist
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return res.status(401).json({
      status: 'fail',
      message: 'the user belonging to token does no longer exist'
    })
  }
  // 4) check if user changed password  after the token was issued
  // freshUser.changedPassword(decoded.iat)

  req.user = freshUser;
  next();
}

//this is a wrap function we use it cuz we cant pass an argument to a middleware function
exports.restrictTo = (...roles) => {
  //roles['admin', 'lead-guide'] . role = user (the argument is an array)
  return (req, res, next) => {
    console.log('protect rout function running');
    console.log(req.user.role);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'you do not have the permission for this action'
      });
    }
    next();
  }
}