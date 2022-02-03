"use strict";
const ParkingRecord = make("App/Models/ParkingRecord");
const ParkingRecordRepository = make("App/Models/Repositories/ParkingRecordRepository");
const ParkTransformer = use("App/Transformers/ParkTransformer");
const UnparkTransformer = use("App/Transformers/UnparkTransformer");
const ParkingRecordTransformer = use("App/Transformers/ParkingRecordTransformer");

class ParkingRecordController {
  async index({transform, request}) {
    const filters = await request.only(["parking_lot_id","parking_slot_id","car_details_id","payment_details_id","keyword",]);
    const results = await ParkingRecordRepository.geParkingRecordList(filters);
    return await transform.paginate(results, ParkingRecordTransformer);
  }

  async show({params, transform}){
    const result = await ParkingRecordRepository.findParkingRecord(params.id);
    return await transform.item(result, ParkingRecordTransformer);
  }

  async park({ request, transform, view }) {
    const payload = request.only(ParkingRecord.fillables);
    const data = await ParkingRecordRepository.getNearestSlot({
      ...payload,
    });
    // return data
    return await transform.item(data, ParkTransformer);
  }

  async unpark({ params, transform }) {
    const data = await ParkingRecordRepository.unpark(params.parking_record_id);
    return await transform.item(data, UnparkTransformer);
  }
}

module.exports = ParkingRecordController;
