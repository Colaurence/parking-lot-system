"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class FullParkingException extends LogicalException {
  handle(error, { response }) {
    return response.status(404).json({
      message: "Parking is full, Please proceed to next parking. Thank you!",
    });
  }
}

module.exports = FullParkingException;
