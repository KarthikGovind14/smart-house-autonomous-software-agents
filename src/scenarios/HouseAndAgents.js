const ElectricStove = require("../devices/ElectricStove");
const Light = require("../devices/Light");
const RoomHeater = require("../devices/RoomHeater");
const Vacuum = require("../devices/Vacuum");
const WashingMachine = require("../devices/WashingMachine");
const Person = require("../Observables/Person");
const Sensor = require("../observables/Sensor");
const Clock = require("../utils/Clock");
const Observable = require("../utils/Observable");
const Agent = require("../bdi/Agent");
const {
  SenseLightsGoal,
  SenseLightsIntention,
  SenseLightSensorsGoal,
  SenseLightSensorsIntention,
  ReturnToNormalIntention,
  PersonOccupancyIntention,
  PersonOccupancyGoal,
  TurnOnLightIntention,
  TurnOffLightIntention,
} = require("../intentions/Lights");
const {
  LightsIntensityIntention,
  LightsIntensityGoal,
} = require("../intentions/Lights");
const {
  SenseElectricStoveGoal,
  SenseElectricStoveIntention,
  TurnOnElectricStoveIntention,
  TurnOffElectricStoveIntention,
  KitchenOccupancyGoal,
  KitchenOccupancyGoalIntention,
} = require("../intentions/ElectricStove");
const {
  PersonRoomOccupancyIntention,
  PersonRoomOccupancyGoal,
} = require("../intentions/RoomOccupancy");
const {
  CleanIntention,
  CleanGoal,
  SenseBatteryIntention,
  SenseBatteryGoal,
  Move,
  HighChargeClean,
  MedChargeClean,
  Charge,
  CleanRoomsIntention,
} = require("../intentions/Vacuum");
const {
  SenseWashingMachineGoal,
  SenseWashingMachineIntention,
  TurnOnWashingMachineIntention,
  TurnOffWashingMachineIntention,
  ReturnWashingMachineToNormalIntention,
} = require("../intentions/WashingMachine");
const {
  SenseRoomHeatersIntention,
  SenseRoomHeatersGoal,
  SenseTemperatureSensorsGoal,
  SenseTemperatureSensorsIntention,
  HeatRoomsIntention,
  HeatRoomsGoal,
  KeepHeatedOccupancyIntention,
  HeatUpIntention,
  HeatOccupancyIntention,
  HeatOccupancyGoal,
} = require("../intentions/RoomHeater");

class House {
  constructor() {
    this.people = {
      thomas: new Person(this, "Thomas"),
    };
    this.rooms = {
      livingroom: {
        name: "livingroom",
        doors_to: ["kitchen", "bedroom", "bathroom"],
        cleaned: true,
      },
      kitchen: { name: "kitchen", doors_to: ["livingroom"], cleaned: true },
      bedroom: { name: "bedroom", doors_to: ["livingroom"], cleaned: true },
      bathroom: { name: "bathroom", doors_to: ["livingroom"], cleaned: false },
    };
    this.devices = {
      //lights
      lights: {
        livingroom_light: new Light(this, "livingroom"),
        kitchen_light: new Light(this, "kitchen"),
        bedroom_light: new Light(this, "bedroom"),
        bathroom_light: new Light(this, "bathroom"),
      },
      //heating
      heatings: {
        livingroom_heating: new RoomHeater(this, "livingroom"),
        kitchen_heating: new RoomHeater(this, "kitchen"),
        bedroom_heating: new RoomHeater(this, "bedroom"),
        bathroom_heating: new RoomHeater(this, "bathroom"),
      },
      //electric stove
      electric_stove: new ElectricStove(this),
      //washing machine
      washing_machine: new WashingMachine(this),
      //vacuum
      vacuum_bot: new Vacuum(this, "vacuumcleaningrobot"),
    };
    this.utilities = {
      electricity: new Observable({ consumption: 0 }),
    };
    this.sensors = {
      //light
      lights: {
        kitchen_light_sensor: new Sensor(this, "light", "kitchen", 0),
        bedroom_light_sensor: new Sensor(this, "light", "bedroom", 0),
        bathroom_light_sensor: new Sensor(this, "light", "bathroom", 0),
        livingroom_light_sensor: new Sensor(this, "light", "livingroom", 0),
      },
      //temperature
      temperatures: {
        livingroom_temperature_sensor: new Sensor(
          this,
          "temperature",
          "livingroom",
          23
        ),
        kitchen_temperature_sensor: new Sensor(
          this,
          "temperature",
          "kitchen",
          23
        ),
        bedroom_temperature_sensor: new Sensor(
          this,
          "temperature",
          "bedroom",
          23
        ),
        bathroom_temperature_sensor: new Sensor(
          this,
          "temperature",
          "bathroom",
          23
        ),
      },
    };
  }
}

// House and agents
var house = new House();
var houseAgent = new Agent("houseagent");
var botAgent = new Agent("botagent");
botAgent.device = house.devices.vacuum_bot;

// initial beliefset

//bot agent
botAgent.beliefs.declare("in-room livingroom");
botAgent.beliefs.declare("base livingroom");
botAgent.beliefs.declare("high-charge");
botAgent.beliefs.declare("door livingroom kitchen");
botAgent.beliefs.declare("door kitchen livingroom");
botAgent.beliefs.declare("door livingroom bedroom");
botAgent.beliefs.declare("door bedroom livingroom");
botAgent.beliefs.declare("room_occupied bedroom");
for (let r of Object.values(house.rooms)) {
  if (r.cleaned) botAgent.beliefs.declare("cleaned " + r.name);
}

//house agent
houseAgent.beliefs.declare("room_occupied kitchen");
houseAgent.beliefs.declare("house_occupied");
for (let r of Object.values(house.devices.heatings)) {
  houseAgent.beliefs.declare("heating_off " + r.name);
}
for (let r of Object.values(house.devices.lights)) {
  houseAgent.beliefs.declare("light_off " + r.name);
}
for (let p of Object.values(house.people)) {
  houseAgent.beliefs.declare("in_room " + p.name + " kitchen");
}
for (let r of Object.values(house.sensors.lights)) {
  houseAgent.beliefs.declare("light_med " + r.name);
}
for (let r of Object.values(house.sensors.temperatures)) {
  houseAgent.beliefs.declare("temperature_med " + r.name);
}

//goals and intentions

//occupancy
houseAgent.intentions.push(PersonRoomOccupancyIntention);
houseAgent.postSubGoal(
  new PersonRoomOccupancyGoal({ people: Object.values(house.people) })
);

//lights
houseAgent.intentions.push(SenseLightsIntention);
houseAgent.postSubGoal(
  new SenseLightsGoal({ lights: Object.values(house.devices.lights) })
);
houseAgent.intentions.push(SenseLightSensorsIntention);
houseAgent.postSubGoal(
  new SenseLightSensorsGoal({
    sensors: Object.values(house.sensors.lights),
    min: 50,
    max: 80,
  })
);
houseAgent.intentions.push(LightsIntensityIntention);
houseAgent.postSubGoal(
  new LightsIntensityGoal({
    lights: Object.values(house.devices.lights),
    target: 75,
  })
);
houseAgent.intentions.push(TurnOnLightIntention);
houseAgent.intentions.push(TurnOffLightIntention);
houseAgent.intentions.push(ReturnToNormalIntention);
houseAgent.intentions.push(PersonOccupancyIntention);
houseAgent.postSubGoal(
  new PersonOccupancyGoal({ lights: Object.values(house.devices.lights) })
);

//heatings
houseAgent.intentions.push(SenseTemperatureSensorsIntention);
houseAgent.postSubGoal(
  new SenseTemperatureSensorsGoal({
    sensors: Object.values(house.sensors.temperatures),
    low: 16,
    med: 18,
    high: 20,
  })
);
houseAgent.intentions.push(SenseRoomHeatersIntention);
houseAgent.postSubGoal(
  new SenseRoomHeatersGoal({ heatings: Object.values(house.devices.heatings) })
);
houseAgent.intentions.push(HeatRoomsIntention);
houseAgent.postSubGoal(
  new HeatRoomsGoal({ heatings: Object.values(house.devices.heatings) })
);
houseAgent.intentions.push(HeatUpIntention);
houseAgent.intentions.push(KeepHeatedOccupancyIntention);
houseAgent.intentions.push(HeatOccupancyIntention);
houseAgent.postSubGoal(
  new HeatOccupancyGoal({ heatings: Object.values(house.devices.heatings) })
);

//electric stove
houseAgent.intentions.push(SenseElectricStoveIntention);
houseAgent.postSubGoal(
  new SenseElectricStoveGoal({
    electric_stove: house.devices.electric_stove,
  })
);
houseAgent.intentions.push(TurnOnElectricStoveIntention);
houseAgent.intentions.push(TurnOffElectricStoveIntention);
houseAgent.intentions.push(KitchenOccupancyGoalIntention);
houseAgent.postSubGoal(
  new KitchenOccupancyGoal({
    electric_stove: house.devices.electric_stove,
  })
);

//vacuum
botAgent.intentions.push(SenseBatteryIntention);
botAgent.postSubGoal(new SenseBatteryGoal());
let { OnlinePlanning } = require("../pddl/OnlinePlanner")([
  Move,
  HighChargeClean,
  MedChargeClean,
  Charge,
]);
botAgent.intentions.push(OnlinePlanning);
botAgent.intentions.push(CleanRoomsIntention);
houseAgent.intentions.push(CleanIntention);
houseAgent.postSubGoal(
  new CleanGoal({
    hh: 10,
    mm: 0,
    rooms: ["livingroom", "kitchen", "bedroom"],
  })
);

//washing machine
houseAgent.intentions.push(SenseWashingMachineIntention);
houseAgent.postSubGoal(
  new SenseWashingMachineGoal({
    washing_machine: house.devices.washing_machine,
  })
);
houseAgent.intentions.push(TurnOnWashingMachineIntention);
houseAgent.intentions.push(TurnOffWashingMachineIntention);
houseAgent.intentions.push(ReturnWashingMachineToNormalIntention);

//simulate temperature
let last = 0;
Clock.global.observe("mm", () => {
  let t = Clock.minutesFromStart();
  if (t - last >= 30) {
    for (let p of Object.values(house.sensors.temperatures)) {
      if (house.devices.heatings[p.name + "_heating"].status == "off")
        p.increaseValue(-0.1);
    }
    last = t;
  }
});

module.exports = { house, houseAgent, botAgent };
