const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/utils');
const {
  getAllCards, createCard, deleteCard, likeCard, unlikeCard,
} = require('../controllers/cardsController');

const cardsRouter = express.Router();

// Get All Cards
cardsRouter.get('/', getAllCards);

// Create a Card
cardsRouter.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().custom(validateUrl).required(),
  })}), createCard);

// Like a Card
cardsRouter.put('/likes/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().min(24).max(24).required().hex(),
  })}), likeCard);

// Unlike a Card
cardsRouter.delete('/likes/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().min(24).max(24).required().hex(),
  })}), unlikeCard);

cardsRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().min(24).max(24).required().hex(),
  })}), deleteCard);

module.exports = cardsRouter;
