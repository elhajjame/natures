const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const app = require('./app')

mongoose.connect(process.env.DB_CONNECT, {

  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false

}).then((con) => {
  // console.log(con.connections);
  console.log('DB connection successful');
});

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

//always use uppercase for model
const Tour = mongoose.model('Tour', toursSchema)

const testTour = new Tour({
  name: 'The Park Camper',
  price: 997
});

testTour.save().then(doc => {
  console.log(doc);
}).catch(err => {
  console.log('ERROR 💥', err);
});

// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the server running on the port ${port}`);
});