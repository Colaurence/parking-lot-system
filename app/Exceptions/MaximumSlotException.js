"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class MaximumSlotException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "You have reached the maximum slot available in this parking lot!",
    });
  }
}

module.exports = MaximumSlotException;
