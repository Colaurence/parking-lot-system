'use strict'

class StoreParkingSlotDistance {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      parking_slot_id: "required|number",
      entry_point: "required|string",
      distance: "required|number",
    };
  }

  get messages() {
    return {
      "parking_slot_id.required": "Parking slot id is required.",
      "parking_slot_id.number": "Parking slot id must be an integer.",
      "entry_point.required": "Entry point is required.",
      "entry_point.string": "Entry point should be a string.",
      "distance.required": "Sistance is required.",
      "distance.number": "Distance must be an integer.",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
  
}

module.exports = StoreParkingSlotDistance
