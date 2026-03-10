const dotenv = require('dotenv')
dotenv.config({ path: './../../config.env' });
const fs = require('fs');
const mongoose = require('mongoose');
const Tour = require('./../../models/tourModel')

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

mongoose.connect(process.env.DB_CONNECT, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
}).then((con) => {
  // console.log(con.connections);
  console.log('DB connection successful');
});

//IMPOTR DATA INTO DATABASE
const importData = async () => {
  try {
    //This takes the tours from the JSON file and inserts them into the database.
    await Tour.create(tours)
    console.log('the data has been imported successfully!');
  } catch (err) {
    console.log(err);
  }
  process.exit();// this is an agrisive way to stop an application
}

//DELETE DATA FROM DATABASE:
const deleteData = async () => {
  try {
    await Tour.deleteMany()
    console.log('data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
}
if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
// console.log(process.argv);
