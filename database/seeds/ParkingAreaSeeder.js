"use strict";
const ParkingArea = use("App/Models/ParkingArea");
/*
|--------------------------------------------------------------------------
| EntryPointSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use("Factory");

class ParkingAreaSeeder {
  async run() {
    const Area = [
      {
        id: 1,
        parking_rate_id: 1,
        spot: "A1",
      },
      {
        id: 2,
        parking_rate_id: 3,
        spot: "A2",
      },
      {
        id: 3,
        parking_rate_id: 2,
        spot: "A3",
      },
      {
        id: 4,
        parking_rate_id: 1,
        spot: "A4",
      },
      {
        id: 5,
        parking_rate_id: 2,
        spot: "A5",
      },
    ];

    await ParkingArea.createMany(Area);
  }
}

module.exports = ParkingAreaSeeder;
