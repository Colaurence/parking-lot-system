"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = require("moment");

class ParkTransformer extends BumblebeeTransformer {
  async transform(model) {
    const parkingLotData = await model.parkingLots().fetch();
    const parkingSlotData = await model.parkingSlots().fetch();
    const carDetailsData = await model.carDetails().fetch();
    const paymentDetailsData = await model.paymentDetails().fetch();
    return {
      id: model.id,
      entry_point: parkingLotData.entry_point,
      description: parkingLotData.description,
      parking_size:
        parkingLotData.size === 2
          ? "large"
          : parkingLotData.size === 0
          ? "small"
          : "medium",
      flat_rate: parkingLotData.flat_rate,
      hourly_rate: parkingLotData.hourly_rate,
      day_rate: parkingLotData.day_rate,
      parking_slot: parkingSlotData.slot,
      parking_status: parkingSlotData.status,
      car_size: 
      carDetailsData.size === 2
        ? "large"
        : carDetailsData.size === 0
        ? "small"
        : "medium",
      plate_number: carDetailsData.plate_number,
      total_fee: paymentDetailsData.total === null ? 0 : 0,
      pament_status: paymentDetailsData.status,
      park_entry_time: moment(model.created_at).format("MMMM D YYYY, h:mm:ss a"),

    };
  }
}

module.exports = ParkTransformer;