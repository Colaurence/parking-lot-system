"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class CarAlreadyParkedException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "This car is already parked in this parking lot!",
    });
  }
}

module.exports = CarAlreadyParkedException;
