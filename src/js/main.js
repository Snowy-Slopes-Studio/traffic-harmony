import { Playground } from "./game/playground.js";
import { Vehicle } from "./game/vehicles.js";
import { Parking, Road } from "./game/infras.js";

const canva = document.getElementById('playground');

const playground = new Playground(canva);

// Example
const road = new Road({ x: 160, y: 130 }, { x: 500, y: 130 });
playground.addInfra(road);

const parking1 = new Parking({ x: 100, y: 100 }, { x: 60, y: 60 }, 10);
playground.addInfra(parking1);
parking1.connectTo(road, { x: 160, y: 130 });

const parking2 = new Parking({ x: 500, y: 100 }, { x: 60, y: 60 }, 10);
playground.addInfra(parking2);
parking2.connectTo(road, { x: 500, y: 130 });

const vehicle = new Vehicle({ x: 100, y: 100 }, { x: 100, y: 100 }, { x: 500, y: 100 });
parking1.addVehicle(vehicle);