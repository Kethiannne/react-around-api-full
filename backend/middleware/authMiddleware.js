const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res
      .status(403)
      .send({ message: 'Authorization required' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try{
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return res
    .status(403)
    .send({ message: 'Authorization required' });
  }

  req.user = payload;

  next();
};
