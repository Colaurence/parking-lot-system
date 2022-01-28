"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingSlotDistanceSchema extends Schema {
  up() {
    this.create("parking_slot_distances", (table) => {
      table.increments();
      table
        .integer("parking_slot_id")
        .unsigned()
        .references("id")
        .inTable("parking_slots")
        .onDelete("CASCADE");
      table.string("entry_point").notNullable(); // A , B , C
      table.integer("distance").notNullable(); // distance from entry to destination
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_slot_distances");
  }
}

module.exports = ParkingSlotDistanceSchema;
