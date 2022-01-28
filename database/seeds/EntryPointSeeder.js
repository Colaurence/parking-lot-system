'use strict'
const EntryPoint = use('App/Models/EntryPoint')
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

class EntryPointSeeder {
  async run () {
    
    const Entry = [
      {
        id: 1,
        name: 'EP1'
      },
      {
        id: 2,
        name: 'EP2'
      },
      {
        id: 3,
        name: 'EP3'
      },

    ]

    await EntryPoint.createMany(Entry)
  }
}

module.exports = EntryPointSeeder
