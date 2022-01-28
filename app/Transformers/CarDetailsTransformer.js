"use strict";
const moment = require("moment");

const BumblebeeTransformer = use("Bumblebee/Transformer");

class CarDetailsTransformer extends BumblebeeTransformer {
  transform(model) {
    return {
      id: model.id,
      size: model.size,
      plate_number: model.plate_number,
      created_at: moment(model.created_at).format('MMMM D YYYY, h:mm:ss a')
    };
  }
}

module.exports = CarDetailsTransformer;
