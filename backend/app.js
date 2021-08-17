const express = require('express');
const helmet = require('helmet');
const Mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config();
const authMid = require('./middleware/authMiddleware');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');

const { celebrate, Joi, errors } = require('celebrate');
const { createUser, login } = require('./controllers/usersController');

const { PORT = 3000 } = process.env;

// A section setting up the server and connecting to the database
  const app = express();
  app.use(helmet());

  Mongoose.connect('mongodb://localhost:27017/aroundb', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });

// Url Validation for joi
  function validateUrl(string) {
    if(validator.isURL(string)) {
      return string;
    };
  }

// Routers are pulled in here
  app.use(express.json());

// Middleware and Routes

  app.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    })}),
    login
  );
  app.post('/signup', celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().custom(validateUrl),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    })}),
    createUser
  );

  // add , authMid to these routes!!
  app.use('/cards', authMid, cardsRouter);
  app.use('/users', authMid, usersRouter);

  app.get('*', (req, res) => {
    res.status(404).send({ message: 'Requested resource not found' });
  });

// Celebrate Error Handler
  app.use(errors());

// Central Error Handler
app.use((err, _, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message
    });
});


app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
    console.log(`App listening at port ${PORT}`);
});
