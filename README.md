# **Autonomous Software Agents - Project**

University of Trento - Trento, 2022

Karthik Govindarajan - karthik.govindarajan@studenti.unitn.it

## **Project structure**

- src/devices/ - contains devices files
- src/intentions/ - intentions and goals files
- src/observables/ - house observables such as sensors and people
- src/scenarios/ - scenarios definition

## **Scenario**

### **People**

People are managed by a daily schedule in the scenario file

- Thomas

### **Rooms**

- livingroom
- kitchen
- bedroom
- bathroom

### **Devices**

#### **Lights**

Lights provide illumination to rooms

- livingroom_light
- kitchen_light
- bedroom_light
- bathroom_light

### **Sensors**

#### **Light sensors**

Light sensors are managed by a daily schedule in the scenario file and reading is influenced by room lights

- livingroom_light_sensor
- kitchen_light_sensor
- bedroom_light_sensor
- bathroom_light_sensor

### **Utilities**

- electricity

## **Agents**

### **House Agent**

The house agent manages the house. The initial beliefset is defined in the scenario file.

#### **Goals**

The **"sense"** intentions relate to update of the beliefset based on devices, for the other intentions to react at the changes of the beliefset.

- **TurnOnLightGoal**, **TurnOffLightGoal**, **LightOccupancyGoal** - turn light on and off based on room-occupancy
- **PersonOccupancyGoal**, **SenseLightsGoal** - sense for devices to modify beliefset

#### **PDDL domain and problem**

The vacuum cleaning robot can move between rooms that share a door and can only clean rooms that are initially not occupied, the data sharing is done between the devices here to feed the bot on the room occupancy status.

The .pddl domain of the vacuum bot contains 8 predicates:

- **cleaned** - indicates a clean room
- **in-room** - indicates the current room
- **door** - indicates the possibility to pass between two rooms
- **room_occupied** - indicates the room occupancy
- **high-charge** - indicates high charge
- **med-charge** - indicates medium charge
- **low-charge** - indicates low charge
- **base** - indicates the location of the charging base

and 4 pddl actions:

- **move** - moves from a room to another
- **highChargeClean** - cleans the room when has high battery
- **medChargeClean** - cleans the room when has med battery
- **charge** - charges the battery

PDDL file examples:

- **bot_vacuum_domain.pddl** - vacuum agent pddl domain file
- **bot_vacuum_problem.pddl** - vacuum agent example problem, consists in cleaning all rooms and charging

## **Run**

### **Run scenario**

    node index.js

## **Report**

[FinalReport - ASA2022.pdf]

## **GIT**

(https://github.com/KarthikGovind14/smart-house-autonomous-software-agents)

