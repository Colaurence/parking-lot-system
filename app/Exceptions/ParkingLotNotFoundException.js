"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class ParkingLotNotFoundException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "Parking lot does not exist",
    });
  }
}

module.exports = ParkingLotNotFoundException;
