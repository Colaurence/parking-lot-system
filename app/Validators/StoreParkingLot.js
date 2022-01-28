"use strict";

class StoreParkingLot {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      name: "required|string|unique:parking_lots,name",
      maximum_slots: "required|number",
    };
  }

  get messages() {
    return {
      "name.required": "Parking name is required.",
      "name.string": "Parking name must be a string.",
      "name.unique": "Parking name already exists.",
      "maximum_slots.required": "Maximum slots is required.",
      "maximum_slots.number": "Maximum slots must be an integer.",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = StoreParkingLot;
