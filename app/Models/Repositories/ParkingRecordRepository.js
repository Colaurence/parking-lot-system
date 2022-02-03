"use strict";

const CarDetails = use("App/Models/CarDetail");
const ParkingRecord = use("App/Models/ParkingRecord");
const ParkingLot = use("App/Models/ParkingLot");
const ParkingSlot = use("App/Models/ParkingSlot");
const Payment = use("App/Models/PaymentDetail");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");
const CreateException = use("App/Exceptions/CreateException");
const EntryPointNotFoundException = use(
  "App/Exceptions/EntryPointNotFoundException"
);
const FullParkingException = use("App/Exceptions/FullParkingException");
const CarAlreadyParkedException = use(
  "App/Exceptions/CarAlreadyParkedException"
);
const CarAlreadyPaidException = use("App/Exceptions/CarAlreadyPaidException");
const ParkingRecordNotFoundException = use(
  "App/Exceptions/ParkingRecordNotFoundException"
);
const isEmpty = use("lodash/isEmpty");
const moment = require("moment");

class ParkingRecordRepository {
  async geParkingRecordList(filters) {
    return await ParkingRecord.query()
      .parkingLotId(filters["parking_lot_id"])
      .parkingSlotId(filters["parking_slot_id"])
      .carDetailsId(filters["car_details_id"])
      .paymentDetailsId(filters["payment_details_id"])
      .keyword(filters["keyword"])
      .paginate();
  }

  async createPayment() {
    try {
      return await Payment.create({
        total: null,
        status: "pending",
      });
    } catch (error) {
      throw new CreateException(error);
    }
  }

  async getNearestSlot(data) {
    let CarDetails = await this.findByPlateNumber(data.plate_number);

    if (CarDetails === false) {
      CarDetails = await this.create(data.car_size, data.plate_number);
    }
    const car_id = CarDetails.id;

    const isCarParked = await this.findParkingRecordIfAlreadyExists(
      car_id,
      data.plate_number
    );

    if (isCarParked) {
      throw new CarAlreadyParkedException();
    }

    const selectedFields = [
      "parking_slots.slot",
      "parking_slots.size",
      "parking_slots.flat_rate",
      "parking_slots.hourly_rate",
      "parking_slots.day_rate",
      "parking_slots.status",
      "parking_slot_distances.parking_slot_id",
      "parking_slot_distances.entry_point",
      "parking_slot_distances.distance",
    ];

    const model = await ParkingSlot.query()
      .select(selectedFields)
      .leftJoin(
        "parking_slot_distances",
        "parking_slot_distances.parking_slot_id",
        "parking_slots.id"
      )
      .where("status", "available")
      .fetch();

    const query = await model.toJSON();

    const groupBySize = query.reduce((slots, slot) => {
      const checkSizes = slots.map((el) => {
        if (Object.keys(el)[0] !== undefined) {
          return Object.keys(el)[0];
        }
      });

      if (checkSizes.indexOf(slot.size.toString()) === -1) {
        slots = [...slots, { [slot.size]: [] }];
      }

      const sizes = slots.map((el) => Object.keys(el)[0]);
      const idx = sizes.indexOf(slot.size.toString());

      slots[idx][slot.size.toString()].push({
        id: slot.parking_slot_id,
        slot: slot.slot,
        size: slot.size,
        entry_point: slot.entry_point,
        distance: slot.distance,
      });

      return slots;
    }, []);

    const parseByDistance = groupBySize.map((size) => {
      const key = Object.keys(size)[0];
      const parse = size[key].reduce((slot, dist) => {
        if (slot[dist.id] === undefined) {
          slot[dist.id] = {
            id: dist.id,
            slot: dist.slot,
            entry_points: [],
          };
        }

        slot[dist.id].entry_points.push({
          entry_point: dist.entry_point,
          distance: dist.distance,
        });
        return slot;
      }, {});

      return { [key]: parse };
    });

    const carSize = data.car_size;
    const entryPoint = data.entry_point;

    // Test Case 1 Scenario: put car to the nereast space starting with car size (smol car = smol parking)
    const convertToArray = parseByDistance.map((size) => {
      const key = Object.keys(size)[0];
      const spots = [];
      for (const [k, value] of Object.entries(size[key])) {
        spots.push(value);
      }
      return { [key]: spots };
    });

    const getAvailableSizes = convertToArray.map((el) => {
      return Object.keys(el)[0];
    });
    const avlSize = getAvailableSizes.filter(
      (avl) => parseInt(avl) >= parseInt(carSize)
    );
    if (avlSize.length === 0) throw new FullParkingException()

    // const getSlotsIdx = getAvailableSizes;
    // const getSlot = getSlotsIdx.indexOf(avlSize[0].toString());
    // const getSlotKey = Object.keys(convertToArray[getSlot])[0];
    // const testCase1 = convertToArray[getSlot][getSlotKey].sort((a, b) => {
    //   const aa = a.entry_points.find((ep) => ep.entry_point == entryPoint);
    //   const bb = b.entry_points.find((ep) => ep.entry_point == entryPoint);
    //   return aa.distance - bb.distance;
    // });

    // return testCase1

    //Test Case 2 Scenario: put car to the nereast avl space regardless of size
    const convertToArrayNoSizes = parseByDistance.reduce((sizes, size) => {
      const key = Object.keys(size)[0];
      if (parseInt(key) < parseInt(carSize)) {
        return sizes;
      }

      const spots = [];

      for (const [k, value] of Object.entries(size[key])) {
        spots.push(value);
      }
      return [...sizes, ...spots];
    }, []);

    const testCase2 = convertToArrayNoSizes.sort((a, b) => {
      const aa = a.entry_points.find((ep) => ep.entry_point == entryPoint);
      const bb = b.entry_points.find((ep) => ep.entry_point == entryPoint);

      return aa.distance - bb.distance;
    });

    const nearestSlot = testCase2[0].id;
    let payment = await this.createPayment();
    const payment_id = payment.id;

    const payment_record = await this.createParkingRecord(
      nearestSlot,
      car_id,
      payment_id
    );
    return payment_record;
  }

  async unpark(id) {
    const parkingRecord = await this.findParkingRecord(id);
    await this.checkPaymentRecord(parkingRecord.payment_details_id);
    const parkingRate = await this.findParkingRates(
      parkingRecord.parking_slot_id
    );

    let timeIn = moment(parkingRecord.created_at);
    let currentTime = moment();

    let timeSpent = Math.abs(
      Math.ceil(moment.duration(currentTime - timeIn).asHours())
    );
    let total_fee = parseFloat(parkingRate.flat_rate);

    let previousParkingRecord = await this.findPreviousParkingRecord(
      parkingRecord.car_details_id
    );

    let previousTimeIn = null;
    let timeAway = 0;
    console.log(
      moment(parkingRecord.created_at).format("MMMM Do YYYY, h:mm:ss a")
    );
    console.log(moment().format("MMMM Do YYYY, h:mm:ss a"));
    console.log(moment.duration(currentTime - timeIn).asHours());
    console.log(timeSpent);
    if (previousParkingRecord) {
      previousTimeIn = moment(previousParkingRecord.created_at);
      timeAway = Math.abs(
        Math.ceil(moment.duration(timeIn - previousTimeIn).asHours())
      );
      console.log("time away: " + timeAway);

      if (timeAway <= 1) {
        total_fee = 0;
        await this.getComputation(
          id,
          total_fee,
          timeSpent,
          parkingRecord.parking_slot_id,
          parkingRecord.payment_details_id,
          parkingRate.hourly_rate,
          parkingRate.day_rate
        );
      }
    }
    await this.getComputation(
      id,
      total_fee,
      timeSpent,
      parkingRecord.parking_slot_id,
      parkingRecord.payment_details_id,
      parkingRate.hourly_rate,
      parkingRate.day_rate
    );
    return parkingRecord;
  }

  async getComputation(
    id,
    total_fee,
    timeSpent,
    parking_slot_id,
    payment_details_id,
    hourly_rate,
    day_rate
  ) {
    const parkingRecord = await this.findParkingRecord(id);

    if (timeSpent <= 3) {
      console.log("total fee if <= 1 hour:" + total_fee);
      await this.setPaidStatus(parking_slot_id, payment_details_id, total_fee);
      return parkingRecord;
    }

    if (timeSpent >= 24) {
      total_fee = await this.getDayRate(
        total_fee,
        timeSpent,
        hourly_rate,
        day_rate
      );
      console.log("total fee if >= 24 hours:" + total_fee);
      await this.setPaidStatus(parking_slot_id, payment_details_id, total_fee);
      return parkingRecord;
    }

    if (timeSpent > 3) {
      total_fee = await this.getHourlyRate(total_fee, timeSpent, hourly_rate);
      console.log("total fee if >= 3 hours:" + total_fee);
      await this.setPaidStatus(parking_slot_id, payment_details_id, total_fee);
      return parkingRecord;
    }
  }

  async findPreviousParkingRecord(car_details_id) {
    const selectedFields = [
      "parking_slot_distances.entry_point",
      "parking_slots.slot",
      "car_details.plate_number",
      "payment_details.status",
      "payment_details.total",
      "parking_records.created_at",
      "parking_records.updated_at",
    ];

    let model = await ParkingRecord.query()
      .select(selectedFields)
      .leftJoin(
        "parking_slots",
        "parking_records.parking_slot_id",
        "parking_slots.id"
      )
      .leftJoin(
        "parking_slot_distances",
        "parking_slot_distances.parking_slot_id",
        "parking_slots.id"
      )
      .leftJoin(
        "car_details",
        "parking_records.car_details_id",
        "car_details.id"
      )
      .leftJoin(
        "payment_details",
        "parking_records.payment_details_id",
        "payment_details.id"
      )
      .where("car_details.id", car_details_id)
      .andWhere("payment_details.status", "paid")
      .orderBy("created_at", "desc")
      .first();

    return model;
  }

  async findParkingRecordIfAlreadyExists(car_id, plate_number) {
    const checker = await ParkingRecord.query()
      .leftJoin(
        "parking_slots",
        "parking_records.parking_slot_id",
        "parking_slots.id"
      )
      .leftJoin(
        "car_details",
        "parking_records.car_details_id",
        "car_details.id"
      )
      .where("parking_slots.status", "occupied")
      .andWhere("car_details.id", car_id)
      .andWhere("car_details.plate_number", plate_number)
      .first();

    if (checker) {
      return checker;
    }
  }

  async isValidEntryPoint(entry_point) {
    const checker = await ParkingLot.query()
      .where("entry_point", entry_point)
      .first();
    if (checker) {
      return checker;
    }
    throw new EntryPointNotFoundException();
  }

  async findParkingRates(parking_slot_id) {
    const checker = await ParkingSlot.query()
      .where("id", parking_slot_id)
      .first();
    if (checker) {
      return checker;
    }
    throw new RecordNotFoundException();
  }

  async findByPlateNumber(plate_number) {
    const checker = await CarDetails.query()
      .where("plate_number", plate_number)
      .first();
    if (!isEmpty(checker)) {
      return checker;
    }
    return false;
  }

  async create(size, plate_number) {
    try {
      return await CarDetails.create({
        size,
        plate_number,
      });
    } catch (error) {
      throw new CreateException();
    }
  }

  async createParkingRecord(slot_id, car_id, payment_id) {
    try {
      const parkingRecord = await ParkingRecord.create({
        parking_slot_id: slot_id,
        car_details_id: car_id,
        payment_details_id: payment_id,
      });
      await ParkingSlot.query()
        .andWhere("id", slot_id)
        .update({ status: "occupied" });

      return parkingRecord;
    } catch (error) {
      throw new CreateException(error);
    }
  }

  async findParkingRecord(parking_id) {
    const checker = await ParkingRecord.query().where("id", parking_id).first();
    if (checker) {
      return checker;
    }
    throw new ParkingRecordNotFoundException();
  }

  async checkPaymentRecord(payment_id) {
    const checker = await Payment.query()
      .where("id", payment_id)
      .andWhere("status", "paid")
      .first();
    if (checker) {
      throw new CarAlreadyPaidException();
    }
    return false;
  }

  async getHourlyRate(total_fee, time_spent, hourly_rate) {
    if (time_spent < 24 && time_spent > 3) {
      let tempTimeSpent = time_spent - 3;

      let hourlyRate = parseInt(hourly_rate) * tempTimeSpent;

      total_fee = parseFloat(
        parseFloat(total_fee) + parseFloat(hourlyRate)
      ).toFixed(2);

      return total_fee;
    }
  }

  async getDayRate(total_fee, time_spent, hourly_rate, day_rate) {
    if (time_spent >= 24) {
      let tempTimeSpent = time_spent - 24;

      let DayRate = parseFloat(day_rate);

      let hourlyRate =
        tempTimeSpent > 0 ? parseInt(hourly_rate) * tempTimeSpent : 0;

      total_fee = parseFloat(
        parseFloat(DayRate) + parseFloat(hourlyRate)
      ).toFixed(2);

      return total_fee;
    }
  }

  async setPaidStatus(parking_slot_id, payment_details_id, total_fee) {
    const parkingSlot = await ParkingSlot.findByOrFail("id", parking_slot_id);
    parkingSlot.merge({ status: "available" });
    await parkingSlot.save();

    const payment = await Payment.findByOrFail("id", payment_details_id);
    payment.merge({ status: "paid", total: total_fee });
    await payment.save();
  }
}

module.exports = ParkingRecordRepository;
