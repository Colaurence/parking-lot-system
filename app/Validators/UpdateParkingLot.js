"use strict";

class UpdateParkingLot {
  get validateAll() {
    return true;
  }

  get rules() {
    const id = this.ctx.params.id;
    return {
      name: `required|string|unique:parking_lots,name,id,${id}`,
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

module.exports = UpdateParkingLot;
