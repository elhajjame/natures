const express = require('express');

const app = express();

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

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const tourRouter = require('./routers/tourRoutes');
const userRouter = require('./routers/userRoutes')

//mounting (tourRouter) new router on /api/v1/tours
app.use('/api/v1/tours', tourRouter)
app.use('/api/v1/users', userRouter)



module.exports = app