"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class CarSizeParkingException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "Car size can not park in this parking",
    });
  }
}

module.exports = CarSizeParkingException;
