const validator = require('validator');

// Url Validation for joi
function validateUrl(string) {
  if (validator.isURL(string)) {
    return string;
  }
  return false;
}

module.exports = validateUrl;
