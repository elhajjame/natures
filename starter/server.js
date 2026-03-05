const dotenv = require('dotenv')
dotenv.config({ path: './config.env' });
const app = require('./app')
const mongoose = require('mongoose');

mongoose.connect(process.env.DB_CONNECT, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}).then((con) => {
  // console.log(con.connections);
  console.log('DB connection successful');
});

//always use uppercase for model

// const testTour = new Tour({
//   name: 'The Park Camper',
//   price: 997
// });

// testTour.save().then(doc => {
//   console.log(doc);
// }).catch(err => {
//   console.log('ERROR 💥', err);
// });

// console.log(process.env);
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`the server running on the port ${port}`);
});