const Clock = require("../utils/Clock");
const Observable = require("../utils/Observable");

class ElectricStove extends Observable {
  constructor(house) {
    super();
    this.house = house; // reference to the house
    this.name = "kitchen";
    this.set("status", "off"); // observable

    // log
    this.observe("status", (v) => console.log(this.name, "stove turned", v)); // observe
  }
  switchOnStove() {
    this.status = "on";
    this.house.utilities.electricity.consumption += 1;
    let kitchenLightSensor =
      this.house.sensors.lights[this.name + "_light_sensor"];
    if (kitchenLightSensor.status === "off") {
      let start = Clock.minutesFromStart();
      for (let i = 0; i < 20; i++) {
        let t = Clock.minutesFromStart();
        kitchenLightSensor.increaseValue((t - start) * 2);
        if (t - start === 30) this.switchOffStove();
        start = t;
        if (this.status === "off") break;
      }

      return true;
    }
  }
  switchOffStove() {
    if (this.status === "off") return false;
    this.house.utilities.electricity.consumption -= 1;
    this.status = "off";
    return true;
  }
  toJSON() {
    return this.name;
  }
}

module.exports = ElectricStove;
