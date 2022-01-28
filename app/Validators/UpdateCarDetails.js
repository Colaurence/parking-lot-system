"use strict";

class UpdateCarDetails {
  get validateAll() {
    return true;
  }

  get rules() {
    const id = this.ctx.params.id;
    return {
      size: "required|integer|regex:^[0-2]$",
      plate_number: `required|min:6|unique:car_details,plate_number,id,${id}`,
    };
  }

  get messages() {
    return {
      "size.required": "Car size is required!",
      "size.integer": "Car size must be integer!",
      "size.regex": "Car size only accepts 0-2",
      "plate_number.required": "Plate number is required!",
      "plate_number.min": "Plate number should be atleast 6 characters",
      "plate_number.unique": "Plate number already exist!",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = UpdateCarDetails;
