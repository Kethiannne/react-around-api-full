const winston = require('winston');
const expressWinston = require('express-winston');
const path = require('path');
const fs = require('fs');

const logsFolder = 'logs';

if (!fs.existsSync(logsFolder)) {
  fs.mkdirSync(logsFolder);
}

const reqLogger = expressWinston.logger({
  transports: [
    new winston.transports.File({ filename: path.join(logsFolder, '/request.log') }),
  ],
  format: winston.format.json(),
});

const errLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.File({ filename: path.join(logsFolder, '/error.log') }),
  ],
  format: winston.format.json(),
});

module.exports = {
  reqLogger,
  errLogger,
};
