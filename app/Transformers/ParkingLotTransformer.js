"use strict";
const moment = require("moment");
const ParkingSlotTransformer = use("App/Transformers/ParkingSlotTransformer");

const BumblebeeTransformer = use("Bumblebee/Transformer");

class ParkingLotTransformer extends BumblebeeTransformer {

  
  transform(model) {
    return {
      id: model.id,
      name: model.name,
      maximum_slots: model.maximum_slots,
      created_at: moment(model.created_at).format("MMMM D YYYY, h:mm:ss a"),
    };
  }

 
}

module.exports = ParkingLotTransformer;
