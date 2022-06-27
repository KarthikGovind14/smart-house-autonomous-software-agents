const Clock = require("../utils/Clock");
const Observable = require("../utils/Observable");

class WashingMachine extends Observable {
  constructor(house) {
    super();
    this.house = house; // reference to the house
    this.name = "bathroom"; // machine is stationed in bathroom as per design
    this.set("status", "off"); // observable

    // log
    this.observe("status", (v) =>
      console.log(this.name, "washing machine turned", v)
    ); // observe
  }
  switchOnWashingMachine() {
    this.status = "on";
    this.house.utilities.electricity.consumption += 1;
    let start = Clock.minutesFromStart();
    for (let i = 0; i < 60; i++) {
      let t = Clock.minutesFromStart();
      if (t - start === 100) this.switchOffWashingMachine();
      start = t;
      if (this.status === "off") break;
    }

    return true;
  }
  switchOffWashingMachine() {
    if (this.status === "off") return false;
    this.house.utilities.electricity.consumption -= 1;
    this.status = "off";
    return true;
  }
  toJSON() {
    return this.name;
  }
}

module.exports = WashingMachine;
