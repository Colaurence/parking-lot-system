"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class DuplicateParkingLotException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "Parking size has been already created in this parking entry",
    });
  }
}

module.exports = DuplicateParkingLotException;
