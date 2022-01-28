"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class DuplicateParkingSlotException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "slot already exist in this parking!",
    });
  }
}

module.exports = DuplicateParkingSlotException;
