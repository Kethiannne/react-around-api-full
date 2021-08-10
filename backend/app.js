const express = require('express');
const helmet = require('helmet');
const Mongoose = require('mongoose');
const cardsRouter = require('./routes/cardsRouter');
const usersRouter = require('./routes/usersRouter');

const { PORT = 3000 } = process.env;

// A section setting up the server and connecting to the database
const app = express();
app.use(helmet());

Mongoose.connect('mongodb://localhost:27017/aroundb', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
// --__--__--

// Routers are pulled in here
app.use(express.json());
// Temporary Test User Middleware
app.use((req, res, next) => {
  req.user = {
    _id: '60df909c01763ed8702a85d9',
  };

  next();
});
app.use('/cards', cardsRouter);
app.use('/users', usersRouter);

app.get('*', (req, res) => {
  res.status(404).send({ message: 'Requested resource not found' });
});

app.listen(PORT, () => {
  // if everything works fine, the console will show which port the application is listening to
  console.log(`App listening at port ${PORT}`);
});
