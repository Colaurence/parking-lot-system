"use strict";
const ParkingSlotDistanceRepository = make(
  "App/Models/Repositories/ParkingSlotDistanceRepository"
);
const ParkingSlotDistanceTransformer = use("App/Transformers/ParkingSlotDistanceTransformer");
const ParkingSlotDistance = make("App/Models/ParkingSlotDistance");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");

class ParkingSlotController {
  async index({ request, transform }) {
    const filters = await request.only([
      "slot",
      "size",
      "flat_rate",
      "hourly_rate",
      "day_rate",
      "status",
      "keyword",
    ]);
    const results = await ParkingSlotRepository.getParkingSlots(filters);
    return await transform.paginate(results, ParkingSlotTransformer);
  }

  async store({ request, transform }) {
    const payload = request.only(ParkingSlotDistance.fillables);
    const data = await ParkingSlotDistanceRepository.create({
      ...payload,
    });
    return await transform.item(data, ParkingSlotTransformer);
  }

  async show({ params, transform }) {
    const result = await ParkingSlotRepository.findBy(
      params.parking_lot_id,
      params.id
    );
    return await transform.item(result, ParkingSlotTransformer);
  }

  async update({ params, request, transform }) {
    const payload = request.only(ParkingSlot.fillables);
    const data = await ParkingSlotRepository.update(
      params.parking_lot_id,
      params.id,
      { ...payload }
    );
    return await transform.item(data, ParkingSlotTransformer);
  }

  async destroy({ params, response }) {
    try {
      const result = await ParkingSlotRepository.findBy(
        params.parking_lot_id,
        params.id
      );
      await result.delete();
      return response.json({ message: "deleted" });
    } catch (error) {
      throw new RecordNotFoundException();
    }
  }
}

module.exports = ParkingSlotController;
