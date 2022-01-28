"use strict";

const { LogicalException } = require("@adonisjs/generic-exceptions");

class EntryPointNotFoundException extends LogicalException {
  handle(error, { response }) {
    return response.status(400).json({
      message: "Entry point does not exist!",
    });
  }
}

module.exports = EntryPointNotFoundException;
