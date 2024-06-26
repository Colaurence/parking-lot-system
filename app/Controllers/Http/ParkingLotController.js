"use strict";
const ParkingLotRepository = make(
  "App/Models/Repositories/ParkingLotRepository"
);
const ParkingLotTransformer = use("App/Transformers/ParkingLotTransformer");
const ParkingLot = make("App/Models/ParkingLot");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");

class ParkingLotController {
  async index({ request, transform }) {
    const filters = await request.only(["name","maximum_slots","keyword"]);
    const results = await ParkingLotRepository.getParkingLots(filters);
    return await transform.paginate(results, ParkingLotTransformer);
  }

  async store({ request, transform }) {
    const payload = request.only(ParkingLot.fillables);
    const data = await ParkingLotRepository.create({ ...payload });
    return await transform.item(data, ParkingLotTransformer);
  }

  async show({ params, transform }) {
    const result = await ParkingLotRepository.findBy("id", params.id);
    return await transform.item(result, ParkingLotTransformer);
  }

  async update({ params, request, transform }) {
    const payload = request.only(ParkingLot.fillables);
    const data = await ParkingLotRepository.update({ ...payload }, params.id);
    return await transform.item(data, ParkingLotTransformer);
  }

  async destroy({ params, response }) {
    try {
      const result = await ParkingLotRepository.findBy("id", params.id);
      await result.delete();
      return response.json({message: "deleted"});
    } catch (error) {
      throw new RecordNotFoundException();
    }
  }
}

module.exports = ParkingLotController;


// const getAvailableSizes = convertToArray.map((el) => {
    //   return Object.keys(el)[0];
    // });

    

    // const avlSize = getAvailableSizes.filter(
    //   (avl) => parseInt(avl) >= parseInt(carSize)
    // );

    // if (avlSize.length === 0) throw new Error("NO Available parking space");
    // const getSlotsIdx = convertToArray.map((el) => Object.keys(el)[0]);
    // const getSlot = getSlotsIdx.indexOf(avlSize[0].toString());
    // const getSlotKey = Object.keys(convertToArray[getSlot])[0];
    // const testCase1 = convertToArray[getSlot][getSlotKey].sort((a, b) => {
     
    //   const aa = a.entry_points.find((ep) => ep.entry_point == entryPoint);
    //   const bb = b.entry_points.find((ep) => ep.entry_point == entryPoint);
    //   return aa.distance - bb.distance;
    // });
    // return testCase1[0]