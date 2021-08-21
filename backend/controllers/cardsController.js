const Card = require('../models/cardsModel');
const MyErr = require('../errors/errors');

// To prevent repetition
function castErrorHandler(next, err) {
  if ((err.name === 'CastError') || (err.message === 'Cannot read property \'owner\' of null')) {
    next(new MyErr(404, 'Sorry. Thats not a Proper Card'));
  }
  next(err);
}

// Get all Cards
module.exports.getAllCards = (_, res, next) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch(next);
};

// Create a Card
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new MyErr(400, 'Sorry. Thats not a Proper Link'));
      }
      next(err);
    });
};

// Deleting Cards
module.exports.deleteCard = (req, res, next) => {
  const cardId = req.params._id;

  Card.findById(cardId)
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        throw new MyErr(403, 'Authorization error');
      }
      return card;
    })
    .then(() => {
      Card.findByIdAndRemove(cardId)
        .then((card) => {
          if (!card) {
            throw new MyErr(404, 'Card not Found');
          }
          return res.send({ data: card });
        })
        .catch((err) => castErrorHandler(next, err));
    })
    .catch((err) => castErrorHandler(next, err));
};

// Like a Card
module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new MyErr(404, 'Card not Found');
      }
      return res.send({ card });
    })
    .catch((err) => castErrorHandler(next, err));
};

// Unlike a Card
module.exports.unlikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new MyErr(404, 'Card not Found');
      }
      return res.send({ card });
    })
    .catch((err) => castErrorHandler(next, err));
};
