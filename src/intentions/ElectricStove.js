const Goal = require("../bdi/Goal");
const Intention = require("../bdi/Intention");

class SenseElectricStoveGoal extends Goal {}

class SenseElectricStoveIntention extends Intention {
  static applicable(goal) {
    return goal instanceof SenseElectricStoveGoal;
  }

  *exec({ electric_stove } = parameters) {
    yield new Promise(async (res) => {
      while (true) {
        let status = await electric_stove.notifyChange("status");
        this.agent.beliefs.declare(
          "stove_on " + electric_stove.name,
          status == "on"
        );
        this.agent.beliefs.declare(
          "stove_off " + electric_stove.name,
          status == "off"
        );
      }
    });
  }
}

class TurnOnElectricStoveGoal extends Goal {}

class TurnOnElectricStoveIntention extends Intention {
  static applicable(goal) {
    return goal instanceof TurnOnElectricStoveGoal;
  }

  *exec({ electric_stove } = parameters) {
    if (this.agent.beliefs.check("stove_on " + electric_stove.name))
      throw new Error("Failed, electric_stove already turned on");
    return yield electric_stove.switchOnStove();
  }
}

class TurnOffElectricStoveGoal extends Goal {}

class TurnOffElectricStoveIntention extends Intention {
  static applicable(goal) {
    return goal instanceof TurnOffElectricStoveGoal;
  }

  *exec({ electric_stove } = parameters) {
    if (this.agent.beliefs.check("stove_off " + electric_stove.name))
      throw new Error("Failed, electric_stove already turned off");
    yield electric_stove.switchOffStove();
  }
}

class KitchenOccupancyGoal extends Goal {}

class KitchenOccupancyGoalIntention extends Intention {
  static applicable(goal) {
    return goal instanceof KitchenOccupancyGoal;
  }

  *exec({ electric_stove, room, checkAfter = 30 } = parameters) {
    while (true) {
      let status = electric_stove.status;
      if (
        status === "on" &&
        this.agent.beliefs.check("room_occupied " + room.name)
      )
        throw new Error("Genuine case, room occupied and electric_stove on");

      //wait for kitchen occupancy
      let start = Clock.minutesFromStart();
      let wait = new Promise(async (resolve, reject) => {
        while (true) {
          await Clock.global.notifyAnyChange();
          if (Clock.minutesFromStart() - start >= checkAfter) {
            resolve("waited");
            break;
          }
        }
      });
      let occupation = this.agent.beliefs.notifyChange(
        "not room_occupied " + room.name
      );
      yield Promise.race([occupation, wait]);
      if (
        this.agent.beliefs.check("not room_occupied " + room.name) &&
        status === "on"
      )
        electric_stove.switchOffStove();
      else return;
    }
  }
}

module.exports = {
  SenseElectricStoveGoal,
  SenseElectricStoveIntention,
  TurnOnElectricStoveGoal,
  TurnOnElectricStoveIntention,
  TurnOffElectricStoveGoal,
  TurnOffElectricStoveIntention,
  KitchenOccupancyGoal,
  KitchenOccupancyGoalIntention,
};
