"use strict";

const ParkingSlotDistance = use("App/Models/ParkingSlotDistance");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");
const SlotDistanceException = use("App/Exceptions/SlotDistanceException");
const ParkingSlotNotfoundException = use("App/Exceptions/ParkingSlotNotfoundException");
const ParkingSlot = use("App/Models/ParkingSlot");

class ParkingSlotDistanceRepository {
  async getParkingSlotDistance(filters) {
    return await ParkingSlotDistance.query()
      .parkingSlotId(filters["parking_slot_id"])
      .entryPoint(filters["entry_point"])
      .distance(filters["distance"])
      .keyword(filters["keyword"])
      .paginate();
  }

  async create(data) {
    const slot = await ParkingSlot.findBy('id',data.parking_slot_id)
    if(slot){
      const checker = await ParkingSlotDistance.query()
      .where("parking_slot_id", data.parking_slot_id)
      .andWhere("entry_point", data.entry_point)
      .first();
      if(checker){
        throw new SlotDistanceException()
      }
      return await ParkingSlotDistance.create(data);
    }
    throw new ParkingSlotNotfoundException()
    
  }

  async update(data, id) {
    const checker = await ParkingSlotDistance.findBy('id',data.parking_slot_id)
    if (checker) {
      await ParkingSlotDistance.query().where("id", checker.id).update(data);
      return await ParkingSlotDistance.findByOrFail("id", checker.id);
    }
    throw new RecordNotFoundException();
  }

  async findBy(id) {
    const record = await ParkingSlotDistance.findBy("id", id);
    if (!record) {
      throw new RecordNotFoundException();
    }
    return record;
  }
}

module.exports = ParkingSlotDistanceRepository;
