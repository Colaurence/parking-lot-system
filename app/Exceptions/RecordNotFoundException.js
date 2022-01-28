'use strict'

const { LogicalException } = require('@adonisjs/generic-exceptions')

class RecordNotFoundException extends LogicalException {
  handle(error, { response }) {
    return response.status(404).json({
      message: "Record Not Found",
    });
  }
}

module.exports = RecordNotFoundException
