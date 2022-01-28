"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParkingRecord extends Model {
  static get fillables() {
    return ["entry_point", "car_size" , "plate_number"];
  }

  static scopeParkingLotId(query, parking_lot_id) {
    if (parking_lot_id) {
      return query.where("parking_lot_id", "like", "%" + parking_lot_id + "%");
    }
    return query;
  }

  static scopeParkingSlotId(query, parking_slot_id) {
    if (parking_slot_id) {
      return query.where("parking_slot_id", "like", "%" + parking_slot_id + "%");
    }
    return query;
  }

  static scopeCarDetailsId(query, car_details_id) {
    if (car_details_id) {
      return query.where("car_details_id", "like", "%" + car_details_id + "%");
    }
    return query;
  }

  static scopePaymentDetailsId(query, payment_details_id) {
    if (payment_details_id) {
      return query.where("payment_details_id", "like", "%" + payment_details_id + "%");
    }
    return query;
  }

  static scopeKeyword(query, keyword) {
    if (keyword) {
      return query
        .where("parking_lot_id", "like", "%" + keyword + "%")
        .orWhere("parking_slot_id", "like", "%" + keyword + "%")
        .orWhere("car_details_id", "like", "%" + keyword + "%")
        .orWhere("payment_details_id", "like", "%" + keyword + "%")
    }
    return query;
  }


  parkingLots() {
    return this.belongsTo("App/Models/ParkingLot", "parking_lot_id", "id");
  }

  parkingSlots() {
    return this.belongsTo("App/Models/ParkingSlot", "parking_slot_id", "id");
  }

  paymentDetails() {
    return this.belongsTo(
      "App/Models/PaymentDetail",
      "payment_details_id",
      "id"
    );
  }

  carDetails(){
    return this.belongsTo(
      "App/Models/CarDetail",
      "car_details_id",
      "id"
    );
  }
}

module.exports = ParkingRecord;
