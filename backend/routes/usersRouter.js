const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, createUser, getUserById, editUserInfo, editAvatar, getCurrentUser,
} = require('../controllers/usersController');

const usersRouter = express.Router();


// next up, add joi validation to requests coming through the routers

// Get All Users
usersRouter.get('/', getAllUsers);

// Get The Current User
usersRouter.get('/me', getCurrentUser);

// Get A Single User
usersRouter.get('/:_id', getUserById);

// Create a New User
usersRouter.post('/', createUser);

// Edit User Info
usersRouter.patch('/me', editUserInfo);

// Edit User Avater
usersRouter.patch('/me/avatar', editAvatar);

module.exports = usersRouter;
