'use strict'
const ParkingRate = use('App/Models/ParkingRate')
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
const Factory = use('Factory')

class ParkingRateSeeder {
  async run () {
    
    const rates = [
      {
        id: 1,
        size: 'SP',
        rate: 20
      },
      {
        id: 2,
        size: 'MP',
        rate: 60
      },
      {
        id: 3,
        size: 'LP',
        rate: 100
      }
    ]

    await ParkingRate.createMany(rates)
  }
}

module.exports = ParkingRateSeeder
