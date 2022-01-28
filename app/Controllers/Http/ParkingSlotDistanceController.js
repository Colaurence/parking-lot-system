"use strict";
const ParkingSlotDistanceRepository = make(
  "App/Models/Repositories/ParkingSlotDistanceRepository"
);
const ParkingSlotDistanceTransformer = use(
  "App/Transformers/ParkingSlotDistanceTransformer"
);
const ParkingSlotDistance = make("App/Models/ParkingSlotDistance");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");

class ParkingSlotDistanceController {
  async index({ request, transform }) {
    const filters = await request.only([
      "parking_slot_id",
      "entry_point",
      "distance",
      "keyword",
    ]);
    const results = await ParkingSlotDistanceRepository.getParkingSlotDistance(
      filters
    );
    return await transform.paginate(results, ParkingSlotDistanceTransformer);
  }

  async store({ request, params, transform }) {
    const payload = request.only(ParkingSlotDistance.fillables);
    const data = await ParkingSlotDistanceRepository.create({
      ...payload,
    });
    return await transform.item(data, ParkingSlotDistanceTransformer);
  }

  async show({ params, transform }) {
    const result = await ParkingSlotDistanceRepository.findBy(params.id);
    return await transform.item(result, ParkingSlotDistanceTransformer);
  }

  async update({ params, request, transform }) {
    const payload = request.only(ParkingSlotDistance.fillables);
    const data = await ParkingSlotDistanceRepository.update(
      { ...payload }
    );
    return await transform.item(data, ParkingSlotDistanceTransformer);
  }

  async destroy({ params, response }) {
    try {
      const result = await ParkingSlotDistanceRepository.findBy(params.id);
      await result.delete();
      return response.json({ message: "deleted" });
    } catch (error) {
      throw new RecordNotFoundException();
    }
  }
}

module.exports = ParkingSlotDistanceController;
