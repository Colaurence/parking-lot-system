"use strict";

class StoreCarDetails {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      size: "required|integer|regex:^[0-2]$",
      plate_number: "required|unique:car_details,plate_number|min:6",
    };
  }

  get messages() {
    return {
      "size.required": "Car size is required!",
      "size.number": "Car size must be integer!",
      "size.regex": "Car size only accepts 0-2",
      "plate_number.required": "Plate number is required!",
      "plate_number.unique": "Plate number already exist!",
      "plate_number.min": "Plate number should be atleast 6 characters",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = StoreCarDetails;
