"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

// store car details
Route.group(() => {
  Route.get("/", "CarDetailController.index");
  Route.get("/:plate_number", "CarDetailController.show");
  Route.post("/", "CarDetailController.store").validator(["StoreCarDetails"]);
  Route.put("/:id", "CarDetailController.update").validator([
    "UpdateCarDetails",
  ]);
}).prefix("api/v1/car-details");



Route.group(() => {
  // store parking lots
  Route.get("/", "ParkingLotController.index");
  Route.get("/:id", "ParkingLotController.show");
  Route.post("/", "ParkingLotController.store").validator(["StoreParkingLot"]);
  Route.put("/:id", "ParkingLotController.update").validator(["UpdateParkingLot",]);
  Route.delete("/:id", "ParkingLotController.destroy");
  // store parking slots
  Route.get("/parking-slot/list", "ParkingSlotController.index");
  Route.get("/:parking_lot_id/parking-slot/:id", "ParkingSlotController.show");
  Route.post("/:parking_lot_id/parking-slot","ParkingSlotController.store").validator(["StoreParkingSlot"]);
  Route.put("/:parking_lot_id/parking-slot/:id","ParkingSlotController.update").validator(["UpdateParkingSlot"]);
  Route.delete("/:parking_lot_id/parking-slot/:id","ParkingSlotController.destroy");
}).prefix("api/v1/parking-lots");


// parking slot distance
Route.group(() => {
  Route.get("/", "ParkingSlotDistanceController.index")
  Route.get("/:id", "ParkingSlotDistanceController.show")
  Route.post("/", "ParkingSlotDistanceController.store").validator(["StoreParkingSlotDistance"]);
  Route.put("/", "ParkingSlotDistanceController.update").validator(["StoreParkingSlotDistance"]);
}).prefix("api/v1/parking-slot-distance");


// parking records
Route.group(() => {
  Route.get("/list", "ParkingRecordController.index")
  Route.get("/list/:id", "ParkingRecordController.show")
  Route.post("/park", "ParkingRecordController.park").validator(["StoreParkingRecord"]);
  Route.post("/:parking_record_id/unpark", "ParkingRecordController.unpark")
}).prefix("api/v1/parking-record");

Route.on("/").render("welcome");
