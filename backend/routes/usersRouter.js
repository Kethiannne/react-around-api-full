const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/utils');
const {
  getAllUsers, createUser, getUserById, editUserInfo, editAvatar, getCurrentUser,
} = require('../controllers/usersController');

const usersRouter = express.Router();

// next up, add joi validation to requests coming through the routers

// Get All Users
usersRouter.get('/', getAllUsers);

// Get The Current User
usersRouter.get('/me', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().min(24).max(24).required(),
    })
  })}), getCurrentUser);

// Get A Single User
usersRouter.get('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().min(24).max(24).required(),
  })}), getUserById);

// Create a New User (joi validation for this one happens in app.js)
usersRouter.post('/', createUser);

// Edit User Info
usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(40).required(),
    about: Joi.string().min(2).max(399).required(),
  })}), editUserInfo);

// Edit User Avater
usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateUrl).required(),
  })}), editAvatar);

module.exports = usersRouter;
