"use strict";

const CarDetail = use("App/Models/CarDetail");
const CreateException = use("App/Exceptions/CreateException");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");
const isEmpty = use("lodash/isEmpty");
class CarDetailsRepository {
  async getCarDetails(filters) {
    return await CarDetail.query()
      .size(filters["size"])
      .plateNumber(filters["plate_number"])
      .keyword(filters["keyword"])
      .paginate();
  }

  async create(data) {
    try {
      return await CarDetail.create(data);
    } catch (error) {
      throw new CreateException();
    }
  }

  async update(data, id) {
    try {
      const checker = await CarDetail.findByOrFail("id", id);
      if (checker) {
        await CarDetail.query().where("id", checker.id).update(data);
        const result = await CarDetail.findByOrFail("id", checker.id);
        return result;
      }
    } catch (error) {
      throw new RecordNotFoundException();
    }
  }

  async findByPlateNumber(plate_number) {
    const checker = await CarDetail.query()
      .where("plate_number", plate_number)
      .first();
    if (!isEmpty(checker)) {
      return checker;
    }
    throw new RecordNotFoundException();
  }
}

module.exports = CarDetailsRepository;
