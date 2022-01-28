"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class CarDetailsSchema extends Schema {
  up() {
    this.create("car_details", (table) => {
      table.increments();
      table.integer("size").notNullable(); // 0 = small, 1 = medium, 2 = large
      table.string("plate_number").notNullable();
      table.timestamps();
    });
  }

  down() {
    this.drop("car_details");
  }
}

module.exports = CarDetailsSchema;
