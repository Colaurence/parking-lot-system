"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class ParkingSlotNotfoundException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "This parking slot id does not exist!",
    });
  }
}

module.exports = ParkingSlotNotfoundException;
