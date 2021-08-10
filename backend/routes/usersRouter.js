const express = require('express');
const {
  getAllUsers, createUser, getUserById, editUserInfo, editAvatar,
} = require('../controllers/usersController');

const usersRouter = express.Router();

// Get All Users
usersRouter.get('/', getAllUsers);

// Get A Single User
usersRouter.get('/:_id', getUserById);

// Create a New User
usersRouter.post('/', createUser);

// Edit User Info
usersRouter.patch('/me', editUserInfo);

// Edit User Avater
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
