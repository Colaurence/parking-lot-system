"use strict";
const moment = require("moment");
const BumblebeeTransformer = use("Bumblebee/Transformer");

class ParkingSlotTransformer extends BumblebeeTransformer {
  transform(model) {
    return {
      id: model.id,
      parking_lot_id: model.parking_lot_id,
      slot: model.slot,
      size: model.size === 2 ? "large" : model.size === 0 ? "small" : "medium",
      flat_rate: model.flat_rate,
      hourly_rate: model.hourly_rate,
      day_rate: model.day_rate,
      status: model.status,
      status: model.status,
      created_at: moment(model.created_at).format("MMMM D YYYY, h:mm:ss a"),
    };
  }
}

module.exports = ParkingSlotTransformer;
