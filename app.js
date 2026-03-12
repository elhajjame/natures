const express = require('express');
const appError = require('./utils/appError')
const app = express();
app.set('query parser', 'extended');

// exports.checkID = (req, res, next, val) => {
//   const id = req.params.id * 1
//   if (id > getAllTours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message:'invalid Id'
//     })
//   }
//   next();
// }

// exports.checkBody = (req,res,next)=>{
//   if (!req.body.name || !req.body.price) {
//     return res.status(404).json({
//       status:'fail',
//       message:'invalid inputs'
//     })
//   }
//   next()
// }

// ------------ MIDDLEWARE -------------

console.log(process.env.NODE_ENV);
const morgan = require('morgan');
if (process.env.NODE_ENV === 'development') {
  // dev => tiny
  app.use(morgan('tiny'))
}

app.use(express.json());
// in this case we used it :
// eads raw request body
// Parses JSON
// Converts it into a JavaScript object
// Attaches it to req.body

app.use((req, res, next) => {
  console.log('hello from the middleware 👋 ');
  next();
});

const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes')


//mounting (tourRouter) new router on /api/v1/tours
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)

// app.use((req, res, next) => {
//   res.status(404).json({
//     status: 'fail',
//     message: `can not find ${req.originalUrl} on this server`
//   });
//   // const err = new Error(`can not find ${req.originalUrl} on this server`);
//   // next(err)
// })

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message
  })
  next()
})

module.exports = app