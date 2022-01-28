"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class CreateException extends LogicalException {
  handle(error, { response }) {
    return response.status(404).json({
      message: "Failed to create Data",
    });
  }
}

module.exports = CreateException;
