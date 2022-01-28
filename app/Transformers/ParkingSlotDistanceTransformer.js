"use strict";
const moment = require("moment");
const BumblebeeTransformer = use("Bumblebee/Transformer");

class ParkingSlotDistanceTransformer extends BumblebeeTransformer {
  transform(model) {
    return {
      id: model.id,
      parking_slot_id: model.parking_slot_id,
      entry_point: model.entry_point,
      distance: model.distance,
      created_at: moment(model.created_at).format("MMMM D YYYY, h:mm:ss a"),
    };
  }
}

module.exports = ParkingSlotDistanceTransformer;
