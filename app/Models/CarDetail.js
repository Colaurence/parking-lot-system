'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CarDetail extends Model {
  static get fillables() {
    return ["size", "plate_number"];
  }

  static scopeSize(query, size) {
    if (size) {
      return query.where("size", "like", "%" + size + "%");
    }
    return query;
  }

  static scopePlateNumber(query, plateNumber) {
    if (plateNumber) {
      return query.where("plate_number", "like", "%" + plateNumber + "%");
    }
    return query;
  }

  static scopeKeyword(query, keyword) {
    if (keyword) {
      return query
        .where("size", "like", "%" + keyword + "%")
        .orWhere("plate_number", "like", "%" + keyword + "%");
    }
    return query;
  }
}

module.exports = CarDetail
