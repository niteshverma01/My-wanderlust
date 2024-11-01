class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message); // Pass message to the parent Error constructor
    this.statusCode = statusCode;
    this.message = message;
  }
}

module.exports = ExpressError;
