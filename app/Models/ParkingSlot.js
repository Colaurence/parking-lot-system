"use strict";

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use("Model");

class ParkingSlot extends Model {
  static get fillables() {
    return ["slot", "size", "flat_rate", "hourly_rate", "day_rate"];
  }

  static scopeSlot(query, slot) {
    if (slot) {
      return query.where("slot", "like", "%" + slot + "%");
    }
    return query;
  }

  static scopeSize(query, size) {
    if (size) {
      return query.where("size", "like", "%" + size + "%");
    }
    return query;
  }

  static scopeFlatRate(query, flat_rate) {
    if (flat_rate) {
      return query.where("flat_rate", "like", "%" + flat_rate + "%");
    }
    return query;
  }

  static scopeHourlyRate(query, hourly_rate) {
    if (hourly_rate) {
      return query.where("hourly_rate", "like", "%" + hourly_rate + "%");
    }
    return query;
  }

  static scopeDayRate(query, day_rate) {
    if (day_rate) {
      return query.where("day_rate", "like", "%" + day_rate + "%");
    }
    return query;
  }

  static scopeStatus(query, status) {
    if (status) {
      return query.where("status", "like", "%" + status + "%");
    }
    return query;
  }

  static scopeKeyword(query, keyword) {
    if (keyword) {
      return query
        .where("slot", "like", "%" + keyword + "%")
        .orWhere("size", "like", "%" + keyword + "%")
        .orWhere("flat_rate", "like", "%" + keyword + "%")
        .orWhere("hourly_rate", "like", "%" + keyword + "%")
        .orWhere("day_rate", "like", "%" + keyword + "%")
        .orWhere("status", "like", "%" + keyword + "%")
    }
    return query;
  }

  parkingLots() {
    return this.belongsTo("App/Models/ParkingLot", "parking_slot_id", "id");
  }

  parkingRecord() {
    return this.hasMany("App/Models/ParkingRecord", "id", "parking_slot_id");
  }

  parkingSlotDistance() {
    return this.hasMany("App/Models/ParkingSlotDistance", "parking_slot_id", "id");
  }
}

module.exports = ParkingSlot;
