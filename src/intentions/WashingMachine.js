const Goal = require("../bdi/Goal");
const Intention = require("../bdi/Intention");

class SenseWashingMachineGoal extends Goal {}

class SenseWashingMachineIntention extends Intention {
  static applicable(goal) {
    return goal instanceof SenseWashingMachineGoal;
  }

  *exec({ washing_machine } = parameters) {
    yield new Promise(async (res) => {
      while (true) {
        let status = await washing_machine.notifyChange("status");
        this.agent.beliefs.declare(
          "washingMachine_on " + washing_machine.name,
          status == "on"
        );
        this.agent.beliefs.declare(
          "washingMachine_off " + washing_machine.name,
          status == "off"
        );
      }
    });
  }
}

class TurnOnWashingMachineGoal extends Goal {}

class TurnOnWashingMachineIntention extends Intention {
  static applicable(goal) {
    return goal instanceof TurnOnWashingMachineGoal;
  }

  *exec({ washing_machine } = parameters) {
    if (this.agent.beliefs.check("washingMachine_on " + washing_machine.name))
      throw new Error("Failed, washing_machine already turned on");
    return yield washing_machine.turnOnWashingMachine();
  }
}

class TurnOffWashingMachineGoal extends Goal {}

class TurnOffWashingMachineIntention extends Intention {
  static applicable(goal) {
    return goal instanceof TurnOffWashingMachineGoal;
  }

  *exec({ washing_machine } = parameters) {
    if (this.agent.beliefs.check("washingMachine_off " + washing_machine.name))
      throw new Error("Failed, washing_machine already turned off");
    yield washing_machine.turnOffWashingMachine();
  }
}

class ReturnToNormalGoal extends Goal {}

class ReturnWashingMachineToNormalIntention extends Intention {
  static applicable(goal) {
    return goal instanceof ReturnToNormalGoal;
  }
  *exec({ washing_machine, after=100 } = parameters) {
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
    yield Promise.race([wait]);
    if (washing_machine.status === "off")
      throw new Error("Failed, washing already turned off");
    washing_machine.switchOffWashingMachine();
  }
}

module.exports = {
  SenseWashingMachineGoal,
  SenseWashingMachineIntention,
  TurnOnWashingMachineGoal,
  TurnOnWashingMachineIntention,
  TurnOffWashingMachineGoal,
  TurnOffWashingMachineIntention,
  ReturnToNormalGoal,
  ReturnWashingMachineToNormalIntention,
};
