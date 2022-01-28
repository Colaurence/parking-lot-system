"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingSlotSchema extends Schema {
  up() {
    this.create("parking_slots", (table) => {
      table.increments();
      table
        .integer("parking_lot_id")
        .unsigned()
        .references("id")
        .inTable("parking_lots")
        .onDelete("CASCADE");
      table.integer("slot").notNullable(); //1, 2, 3, 4, 5
      table.integer("size").notNullable(); // 0 = small, 1 = medium, 2 = large
      table.decimal("flat_rate").default(40.0);
      table.decimal("hourly_rate").notNullable();
      table.decimal("day_rate").notNullable();
      table.string('status').default('available')
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_slots");
  }
}

module.exports = ParkingSlotSchema;
