"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class FullParkingException extends LogicalException {
  handle(error, { response }) {
    return response.status(404).json({
      message: "There is no available parking slot for your car!",
    });
  }
}

module.exports = FullParkingException;
