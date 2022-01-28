"use strict";

class StoreParkingSlot {
  get validateAll() {
    return true;
  }

  get rules() {
    return {
      slot: "required|number",
      size: "required|number|regex:^[0-2]$",
      flat_rate: "required|number",
      hourly_rate: "required|number",
      day_rate: "required|number",
    };
  }

  get messages() {
    return {
      "slot.required": "Slot is required!",
      "slot.number": "Slot must be an integer!",
      "size.required": "Size is required!",
      "size.number": "Size must be an integer!",
      "size.regex": "Size only accepts 0-2!",
      "flat_rate.required": "Flat rate is required!",
      "flat_rate.number": "Flat rate should be a decimal!",
      "hourly_rate.required": "Hourly rate is required!",
      "hourly_rate.number": "Hourly rate should be a decimal!",
      "day_rate.required": "Day rate is required!",
      "day_rate.number": "Day rate should be a decimal!",
      
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(422).json({ error: errorMessages });
  }
}

module.exports = StoreParkingSlot;
