const mongoose = require('mongoose');

// here we use new mongoose.Schema to specify a Schema for our data
const toursSchema = new mongoose.Schema({
  //this object called : Schema type options
  name: {
    type: String,
    // this call a validator
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    required: [true, 'A tour must have a price']
  }
});
const Tour = mongoose.model('Tour', toursSchema)
module.exports = Tour;