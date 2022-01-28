"use strict";

const CarDetails = use("App/Models/CarDetail");
const ParkingRecord = use("App/Models/ParkingRecord");
const ParkingLot = use("App/Models/ParkingLot");
const ParkingSlot = use("App/Models/ParkingSlot");
const Payment = use("App/Models/PaymentDetail");
const RecordNotFoundException = use("App/Exceptions/RecordNotFoundException");
const CreateException = use("App/Exceptions/CreateException");
const CarSizeParkingException = use("App/Exceptions/CarSizeParkingException");
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
const DB = use("Database");
const isNil = use("lodash");
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

    // {
    //   slot: 24,
    //   size: 0,
    //   flat_rate: 40,
    //   hourly_rate: 20,
    //   day_rate: 5000,
    //   status: 'available',
    //   parking_slot_id: 24,
    //   entry_point: 'B',
    //   distance: 15
    // }
    const query = await model.toJSON();
    return query.reduce((slots, slot) => {
      if (slots[slot.size] === undefined) {
        slots = [...slots, { [slot.size]: [] }];
      }

      const idx = slots.map((el) => Object.keys(el)[0]);
      console.log(idx);
      // slots[idx][slot.size].push({
      //   id: slot.parking_slot_id,
      //   slot: slot.slot,
      //   entry_point: slot.entry_point,
      //   distance: slot.distance,
      //   flat_rate: slot.flat_rate,
      //   hourly_rate: slot.hourly_rate,
      //   day_rate: slot.day_rate,
      //   status: slot.status,
      // });

      return slots;
    }, []);
  }

  async isFullParking(selectedFields, parkingSize) {
    const isFullParking = await ParkingSlot.query()
      .select(selectedFields)
      .leftJoin(
        "parking_lots",
        "parking_lots.id",
        "parking_slots.parking_lot_id"
      )
      .where("status", "available")
      .andWhere("parking_lots.size", parkingSize)
      .fetch();
    if (isFullParking.rows == 0) {
      return 1;
    }
    return 0;
  }

  async unpark(id) {
    const parkingRecord = await this.findParkingRecord(id);
    await this.checkPaymentRecord(parkingRecord.payment_details_id);
    const parkingRate = await this.findParkingRates(
      parkingRecord.parking_lot_id
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
      "parking_records.id",
      "parking_lots.description",
      "parking_lots.entry_point",
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
        "parking_lots",
        "parking_records.parking_lot_id",
        "parking_lots.id"
      )
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

  async findParkingRates(parking_lot_id) {
    const checker = await ParkingLot.query()
      .where("id", parking_lot_id)
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

  async createParkingRecord(lot_id, slot_id, car_id, payment_id) {
    try {
      const parkingRecord = await ParkingRecord.create({
        parking_lot_id: lot_id,
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
