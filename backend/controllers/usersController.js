const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/usersModel');
const jwt = require('jsonwebtoken');

const badReturn = (err) => ({ message: `ServerError ${err}` }
);

// Get All Users
  module.exports.getAllUsers = (_, res) => {
    User.find({})
      .then((users) => {
        res.status(200).send({ data: users });
      })
      .catch((err) => {
        console.log(`Houston we have a problem ${err}`);
        res.status(500).send(badReturn(err));
      });
  };

// Return Current User Info
// still want to test this to see what format it is returned in by default
  module.exports.getCurrentUser = (req, res) => {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return res
        .status(401)
        .send({ message: 'Authorization required' });
    }
    console.log(req.user);
    res.status(201).send(req.user.toJSON());
  };

// Get a Single user
  module.exports.getUserById = (req, res) => {
    const userId = req.params._id;

    User.findById(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not Found' });
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === ('CastError')) {
          res.status(400).send({ message: 'Sorry. Thats not a Proper User' });
        }
        res.status(500).send(badReturn(err));
      });
  };

// Create a User
  module.exports.createUser = (req, res) => {
    const { name, about, avatar, email, password } = req.body;
      bcrypt.hash(password, 10)
        .then((hash) => {
          User.create({ name, about, avatar, email, password: hash })
        })
        .then((user) => res.send({ data: user }))
        .catch((err) => res.status(500).send(badReturn(err)));
  };

// Login a User
  module.exports.login = (req, res) => {
    const { email, password } = req.body;

    return User.findUserByCredentials(email, password)
      .then((user) => {
        const userToken = jwt.sign({ _id: user._id },
                            process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
                            { expiresIn: '7d' }
                          );
        res
        .status(201)
        .send({ userToken });
      })
      .catch((err) => {
        res
          .status(401)
          .send({ message: 'Incorrect email or password' });
      });
  };

// Edit User Info
  module.exports.editUserInfo = (req, res) => {
    const { name, about } = req.body;

    User.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true, new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not Found' });
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === ('CastError')) {
          res.status(400).send({ message: 'Sorry. Thats not a Proper User' });
        }
        res.status(500).send(badReturn(err));
      });
  };

// Edit User Avatar
  module.exports.editAvatar = (req, res) => {
    const { avatar } = req.body;
    User.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true, new: true })
      .then((user) => {
        if (!user) {
          return res.status(404).send({ message: 'User not Found' });
        }
        return res.send({ data: user });
      })
      .catch((err) => {
        if (err.name === ('CastError')) {
          res.status(400).send({ message: 'Sorry. Thats not a Proper User' });
        }
        res.status(500).send(badReturn(err));
      });
  };
