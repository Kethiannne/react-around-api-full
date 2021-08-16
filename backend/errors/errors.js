class MyErr extends Error {
  constructor(errType, message) {
    super(message);
    this.statusCode = errType;
  }
}

module.exports = MyErr;
