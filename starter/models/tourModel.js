const mongoose = require('mongoose');
const validator = require('validator');

// here we use new mongoose.Schema to specify a Schema for our data
const toursSchema = new mongoose.Schema({
  //this object called : Schema type options
  name: {
    type: String,
    // this call a validator
    // built-in validators
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true,
    maxlength: [40, 'a tour must have less or equal then 40 characters'],
    minlength: [10, 'a tour must have more or equal then 10 characters'],
    validate: validator.isAlpha
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have a duration']
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have a group size']
  },
  difficulty: {
    type: String,
    required: [true, 'a tour must have a difficulty'],
    enum: {
      values: ['easy', 'medium', 'difficult'],
      message: 'difficulty is either: easy, medium, difficult '
    }
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
    min: [1, 'rating must be above 1.0'],
    max: [5, 'rating must be below 5.0'],
  },
  rating: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price'],
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        //val means the priceDiscount 250 < 200 // price is the actual price
        // this keyword only points to current doc on NEW document creation
        return val < this.price;
      },
      message: 'the discount price ({VALUE}) should be below the regular price'
    }
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have a description']
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have a cover image']
  },
  images: [String], // an array of strings
  createdAt: {
    type: Date,
    default: Date.now()
  },
  startDates: [Date],
});
const Tour = mongoose.model('Tour', toursSchema)
module.exports = Tour;