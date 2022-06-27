const Clock = require("../utils/Clock");
const Observable = require("../utils/Observable");

class RoomHeater extends Observable {
  constructor(house, name) {
    super();
    this.house = house; // reference to the house
    this.name = name; // non-
    this.set("status", "off"); // observable
    // log
    this.observe("status", (v) => console.log(this.name + " heating " + v)); // observe
  }
  async startRoomHeater() {
    this.status = "on";
    this.house.utilities.electricity.consumption += 1;

    let sensor =
      this.house.sensors.temperatures[this.name + "_temperature_sensor"];
    let start = Clock.minutesFromStart();
    for (let i = 0; i < 100; i++) {
      await Promise.race([
        Clock.global.notifyAnyChange(),
        this.notifyChange("status", "s"),
      ]);
      let t = Clock.minutesFromStart();
      if (t - start >= 15) {
        sensor.increaseValue(0.1);
        start = t;
      }
      if (this.status === "off") break;
    }

    return true;
  }
  stopRoomHeater() {
    this.status = "off";
    this.house.utilities.electricity.consumption -= 1;
    return true;
  }
  toJSON() {
    return this.name;
  }
}

module.exports = RoomHeater;
