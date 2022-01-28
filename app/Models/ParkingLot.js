"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParkingLot extends Model {
  static get fillables() {
    return ["name", "maximum_slots"];
  }

  static scopeName(query, name) {
    if (name) {
      return query.where("name", "like", "%" + name + "%");
    }
    return query;
  }

  static scopeMaximumSlot(query, maximum_slots) {
    if (maximum_slots) {
      return query.where("maximum_slots", "like", "%" + maximum_slots + "%");
    }
    return query;
  }
 
  static scopeKeyword(query, keyword) {
    if (keyword) {
      return query
        .where("name", "like", "%" + keyword + "%")
        .orWhere("maximum_slots", "like", "%" + keyword + "%")
    }
    return query;
  }

  parkingSlots() {
    return this.hasMany("App/Models/ParkingSlot", "id", "parking_lot_id");
  }

  // parkingRecord() {
  //   return this.hasMany("App/Models/ParkingRecord", "id", "parking_lot_id");
  // }
}

module.exports = ParkingLot;
