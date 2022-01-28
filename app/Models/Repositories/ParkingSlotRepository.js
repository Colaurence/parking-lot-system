"use strict";

const ParkingLot = use("App/Models/ParkingLot");
const ParkingSlot = use("App/Models/ParkingSlot");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");
const ParkingLotNotFoundException = use(
  "App/Exceptions/ParkingLotNotFoundException"
);
const DuplicateParkingSlotException = use(
  "App/Exceptions/DuplicateParkingSlotException"
);
const MaximumSlotException = use(
  "App/Exceptions/MaximumSlotException"
);
const isEmpty = use("lodash/isEmpty");


class ParkingSlotRepository {
  async getParkingSlots(filters) {
    return await ParkingSlot.query()
      .slot(filters["slot"])
      .size(filters["size"])
      .flatRate(filters["flat_rate"])
      .hourlyRate(filters["hourly_rate"])
      .dayRate(filters["day_rate"])
      .status(filters["status"])
      .keyword(filters["keyword"])
      .paginate();
  }

  async create(lot_id, data) {
    const checker = await ParkingLot.findBy("id", lot_id);
    const slots_count = await ParkingSlot.query().count("id as total").where('parking_lot_id', lot_id)
    if (checker) {
      const checkIfExist = await checker
        .parkingSlots()
        .where("slot", data.slot)
        .andWhere('parking_lot_id',checker.id)
        .first();
      if (checkIfExist) {
        throw new DuplicateParkingSlotException();
      }
      if(slots_count[0].total < checker.maximum_slots){
        return await checker.parkingSlots().create(data);
      }
      throw new MaximumSlotException()
    }
    throw new ParkingLotNotFoundException();
  }

  async update(lot_id, slot_id, data) {
    const checker = await ParkingLot.findByOrFail("id", lot_id);
    if (checker) {
      await checker.parkingSlots().where("id", slot_id).update(data);
      const result = await ParkingSlot.findByOrFail("id", checker.id);
      return result;
    }
    throw new RecordNotFoundException();
  }

  async findBy(lot_id, slot_id) {
    const record = await ParkingLot.findBy("id", lot_id);
    if (record) {
      const parking_slot = await record
        .parkingSlots()
        .where("id", slot_id)
        .first();
      if (parking_slot) {
        return parking_slot;
      }
      throw new RecordNotFoundException();
    }
    throw new ParkingLotNotFoundException();
  }
}

module.exports = ParkingSlotRepository;
