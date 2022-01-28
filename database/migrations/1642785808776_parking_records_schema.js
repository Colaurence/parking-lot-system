"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingRecordsSchema extends Schema {
  up() {
    this.create("parking_records", (table) => {
      table.increments();
      // table
      //   .integer("parking_lot_id")
      //   .unsigned()
      //   .references("id")
      //   .inTable("parking_lots")
      //   .onDelete("CASCADE");
      table
        .integer("parking_slot_id")
        .unsigned()
        .references("id")
        .inTable("parking_slots")
        .onDelete("CASCADE");
      table
        .integer("car_details_id")
        .unsigned()
        .references("id")
        .inTable("car_details")
        .onDelete("CASCADE");
      table
        .integer("payment_details_id")
        .unsigned()
        .references("id")
        .inTable("payment_details")
        .onDelete("CASCADE");
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_records");
  }
}

module.exports = ParkingRecordsSchema;
