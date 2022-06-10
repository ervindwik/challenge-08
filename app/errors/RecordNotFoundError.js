const ApplicationError = require("./ApplicationError");

class RecordNotFoundError extends ApplicationError {
  constructor() {
    super(`record not found`)
  }
}

module.exports = RecordNotFoundError;
