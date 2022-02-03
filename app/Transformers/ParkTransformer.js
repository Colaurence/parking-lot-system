"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = require("moment");
const ParkingSlotDistance = use("App/Models/ParkingSlotDistance");

class ParkTransformer extends BumblebeeTransformer {
  async transform(model) {
    const parkingSlotData = await model.parkingSlots().fetch();
    const parkingDistanceData = await ParkingSlotDistance.query().where('parking_slot_id',parkingSlotData.id).orderBy('distance','asc').first()
    const carDetailsData = await model.carDetails().fetch();
    const paymentDetailsData = await model.paymentDetails().fetch();
    return {
      id: model.id,
      entry_point: parkingDistanceData.entry_point,
      slot: parkingSlotData.slot,
      parking_size:
      parkingSlotData.size === 2
          ? "large"
          : parkingSlotData.size === 0
          ? "small"
          : "medium",
      flat_rate: parkingSlotData.flat_rate,
      hourly_rate: parkingSlotData.hourly_rate,
      day_rate: parkingSlotData.day_rate,
      parking_slot: parkingSlotData.slot,
      parking_status: parkingSlotData.parking_status,
      car_size: 
      carDetailsData.size === 2
        ? "large"
        : carDetailsData.size === 0
        ? "small"
        : "medium",
      plate_number: carDetailsData.plate_number,
      payment_status: paymentDetailsData.status,
      park_entry_time: moment(paymentDetailsData.created_at).format("MMMM D YYYY, h:mm:ss a"),
    };
  }
}

module.exports = ParkTransformer;
