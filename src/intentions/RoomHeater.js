const Goal = require("../bdi/Goal");
const Intention = require("../bdi/Intention");
const Clock = require("../utils/Clock");

class SenseRoomHeatersGoal extends Goal {}

class SenseRoomHeatersIntention extends Intention {
  static applicable(goal) {
    return goal instanceof SenseRoomHeatersGoal;
  }

  *exec({ heatings } = parameters) {
    var heatingsGoals = [];
    for (let h of heatings) {
      let heatingGoalPromise = new Promise(async (res) => {
        while (true) {
          let status = await h.notifyChange("status");
          this.log("sense: heating " + h.name + " switched " + status);
          this.agent.beliefs.declare("heating_on " + h.name, status === "on");
          this.agent.beliefs.declare("heating_off " + h.name, status === "off");
        }
      });

      heatingsGoals.push(heatingGoalPromise);
    }
    yield Promise.all(heatingsGoals);
  }
}

class SenseTemperatureSensorsGoal extends Goal {}

class SenseTemperatureSensorsIntention extends Intention {
  static applicable(goal) {
    return goal instanceof SenseTemperatureSensorsGoal;
  }

  *exec({ sensors, high, med, low } = parameters) {
    var sensorsGoals = [];
    for (let p of sensors) {
      let sensorGoalPromise = new Promise(async (res) => {
        while (true) {
          let val = await p.notifyChange("value");
          let status = "";
          if (val >= high) {
            status = "high";
            this.log(
              "sense: temperature_sensor " + p.name + " switched " + status
            );
            this.agent.beliefs.declare(
              "temperature_low " + p.name,
              status == "low"
            );
            this.agent.beliefs.declare(
              "temperature_med " + p.name,
              status == "med"
            );
            this.agent.beliefs.declare(
              "temperature_high " + p.name,
              status == "high"
            );
          } else if (val === med) {
            //assume pass over med
            status = "med";
            this.log(
              "sense: temperature_sensor " + p.name + " switched " + status
            );
            this.agent.beliefs.declare(
              "temperature_low " + p.name,
              status == "low"
            );
            this.agent.beliefs.declare(
              "temperature_med " + p.name,
              status == "med"
            );
            this.agent.beliefs.declare(
              "temperature_high " + p.name,
              status == "high"
            );
          } else if (val <= low) {
            status = "low";
            this.log(
              "sense: temperature_sensor " + p.name + " switched " + status
            );
            this.agent.beliefs.declare(
              "temperature_low " + p.name,
              status == "low"
            );
            this.agent.beliefs.declare(
              "temperature_med " + p.name,
              status == "med"
            );
            this.agent.beliefs.declare(
              "temperature_high " + p.name,
              status == "high"
            );
          }
        }
      });
      sensorsGoals.push(sensorGoalPromise);
    }
    yield Promise.all(sensorsGoals);
  }
}

class KeepHeatedOccupancyGoal extends Goal {}

class KeepHeatedOccupancyIntention extends Intention {
  static applicable(goal) {
    return goal instanceof KeepHeatedOccupancyGoal;
  }

  *exec({ heating, after } = parameters) {
    if (this.agent.beliefs.check("not room_occupied " + heating.name))
      throw new Error("Failed, room not occupied");
    //wait for long occupation
    let start = Clock.minutesFromStart();
    let wait = new Promise(async (resolve, reject) => {
      while (true) {
        await Clock.global.notifyAnyChange();
        if (Clock.minutesFromStart() - start >= after) {
          resolve("waited");
          break;
        }
      }
    });
    let occupation = this.agent.beliefs.notifyChange(
      "room_occupied " + heating.name,
      "kh"
    );
    yield Promise.race([occupation, wait]);
    if (this.agent.beliefs.check("not room_occupied " + heating.name)) return;
    //if heating wait
    if (this.agent.beliefs.check("heating_on " + heating.name)) {
      let heat = this.agent.beliefs.notifyChange(
        "heating_off " + heating.name,
        "kh"
      );
      let occupation = this.agent.beliefs.notifyChange(
        "room_occupied " + heating.name,
        "kh"
      );
      yield Promise.race([occupation, heat]);
      if (this.agent.beliefs.check("not room_occupied " + heating.name)) return;
    }
    //room occupied
    //keep heated
    while (true) {
      if (this.agent.beliefs.check("temperature_high " + heating.name)) {
        //if already high wait
        let temperature = this.agent.beliefs.notifyChange(
          "temperature_high " + heating.name,
          "kh"
        );
        let occupation = this.agent.beliefs.notifyChange(
          "room_occupied " + heating.name,
          "kh"
        );
        yield Promise.race([occupation, temperature]);
        if (this.agent.beliefs.check("not room_occupied " + heating.name))
          break;
      } else {
        //heat to high
        heating.startHeating();
        let temperature = this.agent.beliefs.notifyChange(
          "temperature_high " + heating.name,
          "kh"
        );
        let occupation = this.agent.beliefs.notifyChange(
          "room_occupied " + heating.name,
          "kh"
        );
        yield Promise.race([occupation, temperature]);
        heating.stopHeating();
        if (this.agent.beliefs.check("not room_occupied " + heating.name))
          break;
      }
    }
  }
}

class HeatUpGoal extends Goal {}

class HeatUpIntention extends Intention {
  static applicable(goal) {
    return goal instanceof HeatUpGoal;
  }

  *exec({ heating } = parameters) {
    if (this.agent.beliefs.check("heating_on " + heating.name))
      throw new Error("Failed, already heating");
    if (this.agent.beliefs.check("temperature_low " + heating.name)) {
      heating.startHeating();
      yield this.agent.beliefs.notifyChange("temperature_med " + heating.name);
      heating.stopHeating();
    }
  }
}

class HeatRoomsGoal extends Goal {}

class HeatRoomsIntention extends Intention {
  static applicable(goal) {
    return goal instanceof HeatRoomsGoal;
  }
  *exec({ heatings } = parameters) {
    var heatingsGoals = [];
    for (let h of heatings) {
      let heatingGoalPromise = new Promise(async (res) => {
        while (true) {
          let status = await this.agent.beliefs.notifyChange(
            "temperature_low " + h.name
          );
          if (status) {
            this.agent.postSubGoal(new HeatUpGoal({ heating: h }));
          }
        }
      });
      heatingsGoals.push(heatingGoalPromise);
    }
    yield Promise.all(heatingsGoals);
  }
}

class HeatOccupancyGoal extends Goal {}

class HeatOccupancyIntention extends Intention {
  static applicable(goal) {
    return goal instanceof HeatOccupancyGoal;
  }

  *exec({ heatings } = parameters) {
    var heatingsGoals = [];
    for (let h of heatings) {
      let heatingGoalPromise = new Promise(async (res) => {
        while (true) {
          let status = await this.agent.beliefs.notifyChange(
            "room_occupied " + h.name,
            "heating"
          );
          if (status) {
            this.agent.postSubGoal(
              new KeepHeatedOccupancyGoal({ heating: h, after: 5 })
            );
          }
        }
      });
      heatingsGoals.push(heatingGoalPromise);
    }
    yield Promise.all(heatingsGoals);
  }
}

module.exports = {
  SenseRoomHeatersGoal,
  SenseRoomHeatersIntention,
  SenseTemperatureSensorsGoal,
  SenseTemperatureSensorsIntention,
  HeatRoomsGoal,
  HeatRoomsIntention,
  HeatUpGoal,
  HeatUpIntention,
  KeepHeatedOccupancyGoal,
  KeepHeatedOccupancyIntention,
  HeatOccupancyGoal,
  HeatOccupancyIntention,
};
