const express = require('express');
const helmet = require('helmet');
const Mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const MyErr = require('./errors/errors');
require('dotenv').config();
const validateUrl = require('./utils/utils');
const authMid = require('./middleware/authMiddleware');
const errsCentral = require('./middleware/errsCentral');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');
const { reqLogger, errLogger } = require('./middleware/logger');
const { createUser, login } = require('./controllers/usersController');

const { PORT = 3000 } = process.env;

// A section setting up the server and connecting to the database
const app = express();
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
});

const allowedOrigins = [
  'https://www.kethianne-around.students.nomoreparties.site',
  'https://kethianne-around.students.nomoreparties.site',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];
app.use(cors({ origin: allowedOrigins }));

Mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Routers are pulled in here
app.use(express.json());

// Middleware and Routes

// Rate Limiter

app.use(limiter);

// Request Logger
app.use(reqLogger);

// Signin and Signup Routes

// Temporary Crash Test
// DELETE ME!
// app.get('/crash-test', () => {
//   setTimeout(() => {
//     throw new Error('Server will crash now');
//   }, 0);
// });

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(399),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
createUser);

// Main Routers
app.use('/cards', authMid, cardsRouter);
app.use('/users', authMid, usersRouter);

// All Else
app.get('*', (_, __, next) => {
  next(new MyErr(404, 'Requested resource not found'));
});

// Error Handling

// Error Logging
app.use(errLogger);

// Celebrate Error Handler
app.use(errors());

// Central Error Handler
app.use(errsCentral);

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
