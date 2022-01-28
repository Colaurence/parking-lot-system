"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class PaymentDetailsSchema extends Schema {
  up() {
    this.create("payment_details", (table) => {
      table.increments();
      table.decimal("total").default(null);
      table.string("status").default("pending");
      table.timestamps();
    });
  }

  down() {
    this.drop("payment_details");
  }
}

module.exports = PaymentDetailsSchema;
