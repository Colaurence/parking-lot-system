"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class ParkingRecordNotFoundException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "This parking record id does not exist!",
    });
  }
}

module.exports = ParkingRecordNotFoundException;
