'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class PaymentDetail extends Model {

  parkingRecord() {
    return this.hasOne(
      "App/Models/ParkingRecord", 
      "id", 
      "payment_details_id");
  }
}

module.exports = PaymentDetail
