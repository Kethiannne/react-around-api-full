const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const MyErr = require('../errors/errors');

// To prevent repetition
function castErrorHandler(next, err) {
  if ((err.name === 'CastError')) {
    next(new MyErr(404, 'Sorry. Thats not a Proper Card'));
  }
  next(err);
}

// Get All Users
module.exports.getAllUsers = (_, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

// Return Current User Info
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new MyErr(404, 'User not Found');
      }
      return res.send(user);
    })
    .catch((err) => castErrorHandler(next, err));
};

// Get a Single user
module.exports.getUserById = (req, res, next) => {
  const userId = req.params._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new MyErr(404, 'User not Found');
      }
      return res.send({ user });
    })
    .catch((err) => castErrorHandler(next, err));
};

// Create a User
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, about, avatar, email, password: hash,
      })
        .then(() => res.send({ message: 'Successful registration' }))
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new MyErr(409, 'User Already Exists'));
          }
          next(err);
        });
    });
};

// Login a User
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const userToken = jwt.sign({ _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res
        .status(201)
        .send({ userToken });
    })
    .catch(next);
};

// Edit User Info
module.exports.editUserInfo = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new MyErr(404, 'User not Found');
      }
      return res.send({ user });
    })
    .catch((err) => castErrorHandler(next, err));
};

// Edit User Avatar
module.exports.editAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
    .then((user) => {
      if (!user) {
        throw new MyErr(404, 'User not Found');
      }
      return res.send({ user });
    })
    .catch((err) => castErrorHandler(next, err));
};
