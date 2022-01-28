"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParkingSlotDistance extends Model {
  static get fillables() {
    return ["parking_slot_id", "entry_point", "distance"];
  }

  static scopeParkingSlotId(query, parking_slot_id) {
    if (parking_slot_id) {
      return query.where(
        "parking_slot_id",
        "like",
        "%" + parking_slot_id + "%"
      );
    }
    return query;
  }

  static scopeEntryPoint(query, entry_point) {
    if (entry_point) {
      return query.where("entry_point", "like", "%" + entry_point + "%");
    }
    return query;
  }

  static scopeDistance(query, distance) {
    if (distance) {
      return query.where("distance", "like", "%" + distance + "%");
    }
    return query;
  }

  static scopeKeyword(query, keyword) {
    if (keyword) {
      return query
        .where("parking_slot_id", "like", "%" + keyword + "%")
        .orWhere("entry_point", "like", "%" + keyword + "%")
        .orWhere("distance", "like", "%" + keyword + "%");
    }
    return query;
  }

  parkingSlot() {
    return this.hasOne(
      "App/Models/ParkingSlot", 
      "parking_slot_id", 
      "id");
  }
}

module.exports = ParkingSlotDistance;
