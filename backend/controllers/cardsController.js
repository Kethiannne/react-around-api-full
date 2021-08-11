const Card = require('../models/cardsModel');

// To prevent repetition
const badReturn = (err) => ({ message: `ServerError ${err}` }
);

// Get all Cards
module.exports.getAllCards = (_, res) => {
  Card.find({})
    .populate('owner')
    .then((cards) => {
      res.status(200).send({ data: cards });
    })
    .catch((err) => {
      console.log(`Houston we have a problem ${err}`);
      res.status(500).send(badReturn(err));
    });
};

// Create a Card
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({
    name, link, owner: req.user._id,
  })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Sorry. Thats not a Proper Link' });
      }
      res.status(500).send(badReturn(err));
    });
};

// Deleting Cards
module.exports.deleteCard = (req, res) => {
  const cardId = req.params._id;
  const thisCard = Card.findById(cardId);

  // test log, remove me later!!!
  console.log(`the user ${req.user._id}, and the card owner ${thisCard.owner}` );

  if (req.user._id === thisCard.owner){
    Card.findByIdAndRemove(cardId)
      .then((card) => {
        if (!card) {
          return res.status(404).send({ message: 'Card not Found' });
        }
        return res.send({ data: card });
      })
      .catch((err) => {
        if (err.name === ('CastError')) {
          res.status(400).send({ message: 'Sorry. Thats not a Proper Card' });
        }
        res.status(500).send(badReturn(err));
      });
  }

  res.status(500).send(badReturn(err))
};

// Like a Card
module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not Found' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === ('CastError')) {
        res.status(400).send({ message: 'Sorry. Thats not a Proper Card' });
      }
      res.status(500).send(badReturn(err));
    });
};

// Unlike a Card
module.exports.unlikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Card not Found' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === ('CastError')) {
        res.status(400).send({ message: 'Sorry. Thats not a Proper Card' });
      }
      res.status(500).send(badReturn(err));
    });
};
