'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class SlotDistanceException extends LogicalException {
  handle(error, { response }) {
    return response.status(404).json({
      message: "Slot distance has been already created in this entry point!",
    });
  }
}

module.exports = SlotDistanceException
