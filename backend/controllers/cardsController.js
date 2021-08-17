const Card = require('../models/cardsModel');
const MyErr = require('../errors/errors');

// To prevent repetition
  function castErrorHandler(next, err){
    err.name === 'CastError' ?
      next(new MyErr(404, 'Sorry. Thats not a Proper Card')) :
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
        err.name === 'ValidationError' ?
          next(new MyErr(400, 'Sorry. Thats not a Proper Link')) :
          next(err);
      });
  };

// Deleting Cards
  module.exports.deleteCard = (req, res, next) => {
    const cardId = req.params._id;
    const thisCard = Card.findById(cardId);

    // test log, remove me later!!!
    console.log(`the user ${req.body.user._id}, and the card owner ${thisCard.owner}` );

    if (req.user._id === thisCard.owner){
      Card.findByIdAndRemove(cardId)
        .then((card) => {
          if (!card) {
            throw new MyErr(404, 'Card not Found');
          }
          return res.send({ data: card });
        })
        .catch(castErrorHandler(next, err));
    }

    res.status(404).send('badReturn(err)')
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
        return res.send({ data: card });
      })
      .catch(castErrorHandler(next, err));
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
        return res.send({ data: card });
      })
      .catch(castErrorHandler(next, err));
  };
