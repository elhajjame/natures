const express = require('express');
const userController = require('./../controllers/userController')
const authController = require('./../controllers/authController');
console.log(authController.login);

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  // .patch(updateUser)
  .delete(userController.deleteUser)
  .get(userController.getUserByID);

module.exports = router
