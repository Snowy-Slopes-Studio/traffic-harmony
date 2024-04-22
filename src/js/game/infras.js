import { EventListener } from '../lib/MRLib/events.js';
import { getRelationGraph } from './pathfinding.js';
import { Vehicle } from './vehicles.js';

class Map {
    constructor(canvas) {
        this.canvas = canvas;

        this.buildings = [];
        this.roads = [];

        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.redraw();
    }
    redraw() {
        this.buildings.forEach(building => building.draw(this.canvas));
        this.roads.forEach(road => road.draw(this.canvas));
    }

    // Buildings
    addBuilding(building) {
        this.buildings.push(building);
        building.draw(this.canvas);
        this.updateRelations();
        
        this.buildings.forEach(b => {
            b.addEventListener('connected', () => { this.updateRelations(); });
        });
    }
    removeBuilding(building) {
        this.buildings = this.buildings.filter(b => b.id != building.id);
        this.redrawMap();
        this.updateRelations();
    }
    getBuildings() {
        return this.buildings;
    }
    clearBuildings() {
        this.buildings = [];
    }

    // Roads
    addRoad(road) {
        this.roads.push(road);
        road.draw(this.canvas);
        this.updateRelations();

        this.roads.forEach(r => {
            r.addEventListener('connected', () => { this.updateRelations(); });
        });
    }
    removeRoad(road) {
        this.roads = this.roads.filter(r => r.id != road.id);
        this.redrawMap();
        this.updateRelations();
    }
    getRoads() {
        return this.roads;
    }
    clearRoads() {
        this.roads = [];
    }

    // Relations
    updateRelations() {
        this.relations = getRelationGraph(this.buildings.concat(this.roads));
    }
}

/**
 * Connection class - A connection between two infrastructures
 */
class Connection {
    /**
     * Connection - A connection between two infrastructures
     * @param {Infrastructure} from
     * @param {Infrastructure} to
     * @param {object} position {x: int, y: int}
     */
    constructor(from, to, position, bidirectional = false) {
        this.from = from;
        this.to = to;
        this.position = position;
        this.bidirectional = bidirectional;
    }
}

/**
 * Infrastructure class - A building or a road
 * @extends EventListener
 */
class Infrastructure extends EventListener {
    /**
     * Infrastructure - A building or a road
     * @param {object} position {x: int, y: int}
     */
    constructor(position) {
        super();
        this.id = Math.random().toString(36).substr(2, 9);
        this.position = position;
        this.connections = [];
    }

    /**
     * Connect infrastructure to another infrastructure
     * @param {Infrastructure} infra 
     * @param {object} position  {x: int, y: int}
     */
    connectTo(infra, position = this.position, bidirectional = true) {
        if (bidirectional) {
            infra.connections.push(new Connection(infra, this, position, bidirectional));
        }
        this.connections.push(new Connection(this, infra, position, bidirectional));
        this.dispatchEvent('connected');

    }
}

/**
 * Parking class - An infrastructure where vehicles can be parked
 * @extends Infrastructure
 */
class Parking extends Infrastructure {
    /**
     * Parking - An infrastructure where vehicles can be parked
     * @param {object} position {x: int, y: int}
     * @param {object} size {x: int, y: int}
     * @param {int} capacity 
     */
    constructor(position, size, capacity) {
        super(position);
        this.size = size;
        this.capacity = capacity;
        this.vehicles = [];
    }

    /**
     * Draw parking on canvas
     * @param {HTMLCanvasElement} canva 
     */
    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    /**
     * Add vehicle to parking
     * @param {Vehicle} vehicle 
     */
    addVehicle(vehicle) {
        if (this.vehicles.length < this.capacity) {
            this.vehicles.push(vehicle);
            vehicle.position = this.position;
        }
        else {
            console.log('Parking is full');
        }
    }

    /**
     * Remove vehicle from parking
     * @param {Vehicle} vehicle 
     */
    removeVehicle(vehicle) {
        const index = this.vehicles.indexOf(vehicle);
        if (index > -1) {
            this.vehicles.splice(index, 1);
        }
    }
}

/**
 * Road class - An infrastructure that connects buildings
 * @extends Infrastructure
 */
class Road extends Infrastructure {
    /**
     * Road - An infrastructure that connects buildings, cars can drive on it
     * @param {object} start {x: int, y: int}
     * @param {object} end {x: int, y: int}
     */
    constructor(start, end) {
        super(start);
        this.end = end;
    }

    /**
     * Draw road on canvas
     * @param {HTMLCanvasElement} canva 
     */
    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.lineWidth = 20;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }
}

/**
 * Junction class - An infrastructure that connects roads
 * @extends Infrastructure
 */
class Junction extends Infrastructure {
    /**
     * Junction - An infrastructure that connects roads
     * @param {object} position `{x: int, y: int}`
     */
    constructor(position) {
        super(position);
    }

    /**
     * Draw junction on canvas
     * @param {HTMLCanvasElement} canva 
     */
    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(this.position.x, this.position.y, 20, 20);
    }
}

export { Map, Parking, Road, Junction };