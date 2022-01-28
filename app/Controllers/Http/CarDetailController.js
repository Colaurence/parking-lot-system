"use strict";
const CarDetailsRepository = make(
  "App/Models/Repositories/CarDetailsRepository"
);
const CarDetailsTransformer = use("App/Transformers/CarDetailsTransformer");
const CarDetail = make("App/Models/CarDetail");

class CarDetailController {
  async index({ request, transform }) {
    const filters = await request.only(["size", "plate_number", "keyword"]);
    const results = await CarDetailsRepository.getCarDetails(filters);
    return await transform.paginate(results, CarDetailsTransformer);
  }

  async store({ request, transform }) {
    const payload = request.only(CarDetail.fillables);
    const data = await CarDetailsRepository.create({ ...payload });
    return await transform.item(data, CarDetailsTransformer);
  }

  async show({ params, transform }) {
    const result = await CarDetailsRepository.findByPlateNumber(
      params.plate_number
    );
    return await transform.item(result, CarDetailsTransformer);
  }

  async update({ params, request, transform }) {
    const payload = request.only(CarDetail.fillables);
    const data = await CarDetailsRepository.update({ ...payload }, params.id);
    return await transform.item(data, CarDetailsTransformer);
  }
}

module.exports = CarDetailController;
