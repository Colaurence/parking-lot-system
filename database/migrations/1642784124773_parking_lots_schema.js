"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class ParkingLotSchema extends Schema {
  up() {
    this.create("parking_lots", (table) => {
      table.increments();
      table.string("name").notNullable(); // parking name 
      table.integer("maximum_slots").notNullable()
      table.timestamps();
    });
  }

  down() {
    this.drop("parking_lots");
  }
}

module.exports = ParkingLotSchema;
