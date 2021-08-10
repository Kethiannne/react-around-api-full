const User = require('../models/usersModel');

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
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send(badReturn(err)));
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
