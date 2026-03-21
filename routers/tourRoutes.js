const express = require('express');
const tourController = require('./../controllers/tourController')
const authController = require('./../controllers/authController')
const router = express.Router();

router
  .route('/')
  .get(authController.protect, authController.restrictTo('admin'), tourController.getAllTours)
  .post(tourController.createTour);

router
  .route('/:id')
  .patch(tourController.updateTour)
  .delete(authController.protect, authController.restrictTo('admin'), tourController.deleteTour)

  .get(tourController.getTour)
// .get(authController.protect, authController.restrictTo('admin'), tourController.getAllTours);

module.exports = router
