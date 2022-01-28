"use strict";

const ParkingLot = use("App/Models/ParkingLot");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");
const DuplicateParkingLotException = use(
  "App/Exceptions/DuplicateParkingLotException"
);

class ParkingLotRepository {
  async getParkingLots(filters) {
    return await ParkingLot.query()
      .name(filters["name"])
      .maximumSlot(filters["maximum_slots"])
      .keyword(filters["keyword"])
      .paginate();
  }

  async create(data) {
    try {
      return await ParkingLot.create(data);
    } catch (error) {
      throw new CreateException();
    }
  }

  async update(data, id) {
    const checker = await ParkingLot.findByOrFail("id", id);
    if (checker) {
      await ParkingLot.query().where("id", checker.id).update(data);
      return await ParkingLot.findByOrFail("id", checker.id);
      
    }
    throw new RecordNotFoundException();
  }

  async findBy(key, id) {
    const record = await ParkingLot.findBy(key, id);
    if (!record) {
      throw new RecordNotFoundException();
    }
    return record;
  }
}

module.exports = ParkingLotRepository;
