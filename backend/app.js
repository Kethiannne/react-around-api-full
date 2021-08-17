const express = require('express');
const helmet = require('helmet');
const Mongoose = require('mongoose');
require('dotenv').config();
const validateUrl = require('./utils/utils');
const authMid = require('./middleware/authMiddleware');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const { reqLogger, errLogger } = require('./middleware/logger');
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

// Routers are pulled in here
  app.use(express.json());

// Middleware and Routes

// Request Logger
  app.use(reqLogger);

// Signin and Signup Routes
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

// Main Routers
  app.use('/cards', authMid, cardsRouter);
  app.use('/users', authMid, usersRouter);

// All Else
  app.get('*', (req, res) => {
    res.status(404).send({ message: 'Requested resource not found' });
  });

// Error Handling

// Error Logging
  app.use(errLogger);

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
