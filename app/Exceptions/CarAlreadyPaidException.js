"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class CarAlreadyParkedException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "This record is already paid! kindly check if you entered a correct parking id",
    });
  }
}

module.exports = CarAlreadyParkedException;
