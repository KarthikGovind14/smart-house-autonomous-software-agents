const Clock = require("../utils/Clock");
const { house } = require("./HouseAndAgents");

//schedule

// Simulated Daily (Sunday) schedule
Clock.global.observe("mm", (mm) => {
  var time = Clock.global;
  if (time.hh == 0 && time.mm == 5)
    house.devices.lights.bedroom_light.switchOffLightOverride();
  if (time.hh == 10 && time.mm == 0) house.people.thomas.moveTo("livingroom");
  if (time.hh == 10 && time.mm == 5) house.people.thomas.moveTo("bathroom");
  if (time.hh == 10 && time.mm == 10) house.people.thomas.moveTo("livingroom");
  if (time.hh == 10 && time.mm == 15) house.people.thomas.moveTo("kitchen");
  if (time.hh == 10 && time.mm == 20) house.people.thomas.moveTo("kitchen");
  if (time.hh == 10 && time.mm == 25) house.people.thomas.moveTo("livingroom");
  if (time.hh == 10 && time.mm == 30) house.people.thomas.moveTo("bedroom");
  if (time.hh == 10 && time.mm == 35) house.people.thomas.moveTo("bathroom");
  if (time.hh == 10 && time.mm == 40) house.people.thomas.moveTo("bathroom");
  if (time.hh == 10 && time.mm == 45) house.people.thomas.moveTo("livingroom");
  if (time.hh == 10 && time.mm == 50) house.people.thomas.moveTo("kitchen");
  if (time.hh == 10 && time.mm == 55) house.people.thomas.moveTo("livingroom");
  if (time.hh == 11 && time.mm == 0) house.people.thomas.moveTo("kitchen");
  if (time.hh == 11 && time.mm == 5) house.people.thomas.moveTo("bedroom");
  if (time.hh == 11 && time.mm == 10) house.people.thomas.moveTo("livingroom");
  if (time.hh == 11 && time.mm == 15) house.people.thomas.moveTo("bathroom");
  if (time.hh == 11 && time.mm == 20) house.people.thomas.moveTo("livingroom");
  if (time.hh == 11 && time.mm == 25) house.people.thomas.moveTo("kitchen");
  if (time.hh == 11 && time.mm == 30) house.people.thomas.moveTo("null");
  if (time.hh == 13 && time.mm == 10) house.people.thomas.moveTo("livingroom");
  if (time.hh == 13 && time.mm == 15) house.people.thomas.moveTo("bedroom");
  if (time.hh == 13 && time.mm == 20) house.people.thomas.moveTo("kitchen");
  if (time.hh == 14 && time.mm == 15) house.people.thomas.moveTo("livingroom");
  if (time.hh == 14 && time.mm == 30) house.people.thomas.moveTo("bathroom");
  if (time.hh == 14 && time.mm == 45) house.people.thomas.moveTo("null");
  if (time.hh == 19 && time.mm == 25) house.people.thomas.moveTo("livingroom");
  if (time.hh == 19 && time.mm == 30) house.people.thomas.moveTo("kitchen");
  if (time.hh == 19 && time.mm == 35) house.people.thomas.moveTo("bedroom");
  if (time.hh == 19 && time.mm == 40) house.people.thomas.moveTo("bathroom");
  if (time.hh == 19 && time.mm == 45) house.people.thomas.moveTo("kitchen");
  if (time.hh == 20 && time.mm == 00) house.people.thomas.moveTo("livingroom");
  if (time.hh == 20 && time.mm == 05) house.people.thomas.moveTo("livingroom");
  if (time.hh == 20 && time.mm == 10) house.people.thomas.moveTo("bathroom");
  if (time.hh == 20 && time.mm == 15) house.people.thomas.moveTo("kitchen");
  if (time.hh == 20 && time.mm == 20) house.people.thomas.moveTo("livingroom");
  if (time.hh == 20 && time.mm == 25) house.people.thomas.moveTo("bedroom");
  if (time.hh == 20 && time.mm == 30) house.people.thomas.moveTo("bathroom");
  if (time.hh == 20 && time.mm == 35) house.people.thomas.moveTo("bathroom");
  if (time.hh == 20 && time.mm == 40) house.people.thomas.moveTo("kitchen");
  if (time.hh == 20 && time.mm == 45) house.people.thomas.moveTo("bedroom");
  if (time.hh == 20 && time.mm == 50) house.people.thomas.moveTo("bathroom");
  if (time.hh == 20 && time.mm == 55) house.people.thomas.moveTo("bedroom");
  if (time.hh == 21 && time.mm == 0) house.people.thomas.moveTo("kitchen");
  if (time.hh == 21 && time.mm == 05) house.people.thomas.moveTo("bathroom");
  if (time.hh == 21 && time.mm == 10) house.people.thomas.moveTo("bathroom");
  if (time.hh == 21 && time.mm == 15) house.people.thomas.moveTo("kitchen");
  if (time.hh == 21 && time.mm == 20) house.people.thomas.moveTo("bedroom");
  if (time.hh == 21 && time.mm == 25) house.people.thomas.moveTo("kitchen");
  if (time.hh == 21 && time.mm == 30) house.people.thomas.moveTo("bathroom");
  if (time.hh == 21 && time.mm == 35) house.people.thomas.moveTo("livingroom");
  if (time.hh == 21 && time.mm == 40) house.people.thomas.moveTo("kitchen");
  if (time.hh == 21 && time.mm == 45) house.people.thomas.moveTo("livingroom");
  if (time.hh == 21 && time.mm == 50) house.people.thomas.moveTo("bathroom");
  if (time.hh == 21 && time.mm == 55) house.people.thomas.moveTo("bathroom");
  if (time.hh == 22 && time.mm == 0) house.people.thomas.moveTo("bedroom");
});

//Sunday
Clock.global.observe("dd", (dd) => {
  if (dd === 0) {
    process.exit();
  }
});

// Start clock
Clock.startTimer();
