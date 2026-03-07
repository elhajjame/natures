const mongoose = require('mongoose');

// here we use new mongoose.Schema to specify a Schema for our data
const toursSchema = new mongoose.Schema({
  //this object called : Schema type options
  name: {
    type: String,
    // this call a validator
    required: [true, 'A tour must have a name'],
    unique: true,
    trim: true
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
    required: []
  },
  ratingAverage: {
    type: Number,
    default: 4.5
  },
  rating: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  },
  priceDiscount: Number,
  summary: {
    type: String,
    trim: true
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