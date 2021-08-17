const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, likeCard, unlikeCard,
} = require('../controllers/cardsController');

const cardsRouter = express.Router();

// Get All Cards
cardsRouter.get('/', getAllCards);

// Create a Card
cardsRouter.post('/', createCard);

// Like a Card
cardsRouter.put('/:_id/likes', likeCard);

// Unlike a Card
cardsRouter.delete('/:_id/likes', unlikeCard);

cardsRouter.delete('/:_id', deleteCard);

module.exports = cardsRouter;
