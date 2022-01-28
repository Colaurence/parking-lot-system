"use strict";

class StoreParkingRecord {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      entry_point: "required|string",
      car_size: "required|number|regex:^[0-2]$",
      plate_number: "required|string|min:6",
    };
  }

  get messages() {
    return {
      "entry_point.required": "Entry point is required!",
      "entry_point.string": "Entry point should be a string!",
      "car_size.required": "Car size is required!",
      "car_size.number": "Slot must be an integer!",
      "car_size.regex": "Car size only accepts 0-2!",
      "plate_number.required": "Plate number is required!",
      "plate_number.string": "Plate number should be a string!",
      "plate_number.min": "Plate number should be atleast 6 characters",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = StoreParkingRecord;
