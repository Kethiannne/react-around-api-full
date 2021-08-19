module.exports = (err, _, res, __) => {
    const { statusCode = 500, message } = err;
    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'An error occurred on the server'
          : message
      });
  }
