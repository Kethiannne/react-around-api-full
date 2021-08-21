const jwt = require('jsonwebtoken');
require('dotenv').config();
const MyErr = require('../errors/errors');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new MyErr(401, 'Authorization required'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(new MyErr(401, 'Authorization required'));
  }

  req.user = payload;

  next();
};
