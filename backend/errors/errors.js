class MyErr extends Error {
  constructor(errNum, message) {
    super(message);
    this.statusCode = errNum;
  }
}

module.exports = MyErr;
