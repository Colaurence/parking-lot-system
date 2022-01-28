"use strict";
const ParkingEntryPoint = use("App/Models/ParkingEntryPoint");
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

class ParkingEntryPointSeeder {
  async run() {
    const data = [
      {
        id: 1,
        parking_area_id: 1,
        entry_point_id: 1,
        distance: 3,
      },
      {
        id: 2,
        parking_area_id: 2,
        entry_point_id: 1,
        distance: 1,
      },
      {
        id: 3,
        parking_area_id: 3,
        entry_point_id: 1,
        distance: 2,
      },
      {
        id: 4,
        parking_area_id: 4,
        entry_point_id: 1,
        distance: 3,
      },
      {
        id: 5,
        parking_area_id: 5,
        entry_point_id: 1,
        distance: 2,
      },
      {
        id: 6,
        parking_area_id: 1,
        entry_point_id: 2,
        distance: 1,
      },
      {
        id: 7,
        parking_area_id: 2,
        entry_point_id: 2,
        distance: 1,
      },
      {
        id: 8,
        parking_area_id: 3,
        entry_point_id: 2,
        distance: 3,
      },
      {
        id: 9,
        parking_area_id: 4,
        entry_point_id: 2,
        distance: 2,
      },
      {
        id: 10,
        parking_area_id: 5,
        entry_point_id: 2,
        distance: 1,
      },
      {
        id: 11,
        parking_area_id: 1,
        entry_point_id: 3,
        distance: 2,
      },
      {
        id: 12,
        parking_area_id: 2,
        entry_point_id: 3,
        distance: 2,
      },
      {
        id: 13,
        parking_area_id: 3,
        entry_point_id: 3,
        distance: 3,
      },
      {
        id: 14,
        parking_area_id: 4,
        entry_point_id: 3,
        distance: 2,
      },
      {
        id: 15,
        parking_area_id: 5,
        entry_point_id: 3,
        distance: 1,
      },
    ];

    await ParkingEntryPoint.createMany(data);
  }
}

module.exports = ParkingEntryPointSeeder;
