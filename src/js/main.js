import { Playground } from "./game/playground.js";
import { Car } from "./game/vehicles.js";
import { Parking, Road, Junction } from "./game/infras.js";
import { initSettings } from "./game/settings.js";

initSettings();

const canvas = document.getElementById('playground');

const playground = new Playground(canvas);

// Example
const junction1 = new Junction({ x: 16, y: 6 });
playground.map.addRoad(junction1);

const road1 = new Road({ x: 8, y: 6 }, { x: 15, y: 6 });
playground.map.addRoad(road1);
road1.connectTo(junction1, { x: 160, y: 130 });

const parking1 = new Parking({ x: 5, y: 5 }, { x: 3, y: 3 }, 10);
playground.map.addBuilding(parking1);
parking1.connectTo(road1, { x: 160, y: 130 });

const road2 = new Road({ x: 17, y: 6 }, { x: 24, y: 6 });
playground.map.addRoad(road2);
road2.connectTo(junction1, { x: 500, y: 130 });

const parking2 = new Parking({ x: 25, y: 5 }, { x: 3, y: 3 }, 10);
playground.map.addBuilding(parking2);
parking2.connectTo(road2, { x: 500, y: 130 });

const road3 = new Road({ x: 16, y: 7 }, { x: 16, y: 16 });
playground.map.addRoad(road3);
road3.connectTo(junction1, { x: 160, y: 160 });

const road4 = new Road({ x: 15, y: 16 }, { x: 13, y: 16 });
playground.map.addRoad(road4);
road4.connectTo(road3, { x: 160, y: 160 });

const parking3 = new Parking({ x: 10, y: 15 }, { x: 3, y: 3 }, 10);
playground.map.addBuilding(parking3);
parking3.connectTo(road4, { x: 200, y: 300 });

export { playground }