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

const toursSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have a name'],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: Number,
  required: [true, 'A tour must have a price']

});

const Tour = mongoose.model('Tour', toursSchema)

// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the server running on the port ${port}`);
});