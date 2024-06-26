const Observable = require("../utils/Observable");

class Light extends Observable {
  constructor(house, name) {
    super();
    this.house = house; // reference to the house
    this.name = name; // non-observable
    this.set("status", "off"); // observable
    this.set("intensity", 70); // observable
    // log
    this.observe("status", (v) => console.log(this.name, "light turned", v)); // observe
    this.observe("intensity", (v) =>
      console.log(this.name, "light intensity turned", v)
    ); // observe
  }
  switchOnLight() {
    if (this.status === "on") return false;

    let sensor = this.house.sensors.lights[this.name + "_light_sensor"];
    if (this.status === "off" || this.status === "off_override") {
      this.house.utilities.electricity.consumption += 1 * this.intensity;
      sensor.increaseValue(this.intensity);
    }

    this.status = "on";
    return true;
  }
  switchOffLight() {
    if (this.status === "off") return false;

    let sensor = this.house.sensors.lights[this.name + "_light_sensor"];
    if (this.status === "on" || this.status === "on_override") {
      this.house.utilities.electricity.consumption -= 1 * this.intensity;
      sensor.increaseValue(-this.intensity);
    }

    this.status = "off";
    return true;
  }
  switchOnLightOverride() {
    if (this.status === "on_override") return false;

    let sensor = this.house.sensors.lights[this.name + "_light_sensor"];
    if (this.status === "off" || this.status === "off_override") {
      this.house.utilities.electricity.consumption += 1 * this.intensity;
      sensor.increaseValue(this.intensity);
    } else {
      this.house.utilities.electricity.consumption +=
        1 * (100 - this.intensity);
      sensor.increaseValue(100 - this.intensity);
    }

    this.intensity = 100;
    this.status = "on_override";
    return true;
  }
  switchOffLightOverride() {
    if (this.status === "off_override") return false;
    let sensor = this.house.sensors.lights[this.name + "_light_sensor"];
    if (this.status === "on" || this.status === "on_override") {
      this.house.utilities.electricity.consumption -= 1 * this.intensity;
      sensor.increaseValue(-this.intensity);
    }
    this.status = "off_override";
    return true;
  }
  setIntensity(intensity) {
    if (intensity < 0) intensity = 0;
    if (intensity > 100) intensity = 100;
    let sensor = this.house.sensors.lights[this.name + "_light_sensor"];
    if (this.status === "on" || this.status === "on_override") {
      this.house.utilities.electricity.consumption +=
        1 * (intensity - this.intensity);
      sensor.increaseValue(intensity - this.intensity);
    }
    this.intensity = intensity;
  }
  toJSON() {
    return this.name;
  }
}

module.exports = Light;
