import { EventListener } from '../lib/MRLib/events.js';
import { pixelsToCoords, coordsToPixels } from '../lib/MRLib/coords.js';

import { Layer } from './layers.js';
import { getRelationGraph, getShortestRoute } from './pathfinding.js';
import { Vehicle, Car } from './vehicles.js';


class Map extends Layer {
    constructor(canvas, playground) {
        super(canvas, playground);

        this.buildings = [];
        this.roads = [];

        this.resize();

        window.addEventListener('storage', (e) => {
            if (e.key == 'showBuildings' || e.key == 'showRoads') { this.redraw(); }
        });
    }

    redraw() {
        this.clear();
        if (localStorage.getItem('showBuildings') == 'true') {
            this.buildings.forEach(building => building.draw(this.canvas));
        }
        if (localStorage.getItem('showRoads') == 'true') {
            this.roads.forEach(road => road.draw(this.canvas));
        }
    }

    getAllInfrastructures() {
        return this.buildings.concat(this.roads);
    }

    // Buildings
    addBuilding(building) {
        this.buildings.push(building);
        building.map = this;
        building.draw(this.canvas);

        this.updateRelations();
        
        this.buildings.forEach(b => {
            b.addEventListener('connected', () => { this.updateRelations(); });
        });
    }
    removeBuilding(building) {
        this.buildings = this.buildings.filter(b => b.id != building.id);
        this.redraw();
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
        road.map = this;
        road.draw(this.canvas);

        this.updateRelations();

        this.roads.forEach(r => {
            r.addEventListener('connected', () => { this.updateRelations(); });
        });
    }
    removeRoad(road) {
        this.roads = this.roads.filter(r => r.id != road.id);
        this.redraw();
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
        
        this.scale = Number(localStorage.getItem('scale'));
        this.position = position;
        this.canvas_position = coordsToPixels(this.position, Number(localStorage.getItem('scale')));

        this.connections = [];

        window.addEventListener('storage', () => { if (localStorage.getItem('scale')) { this.scale = Number(localStorage.getItem('scale')); }});
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

class Building extends Infrastructure {
    constructor(position, size) {
        super(position);
        this.size = size;
        this.canvas_size = { x: size.x * this.scale, y: size.y * this.scale };

        this.vehicles_interval = setInterval(() => {
            if (Math.random() > 0.9) {
                this.map.playground.entities.addVehicle(new Car(this, this.map.buildings.filter(b => b != this)[Math.floor(Math.random() * this.map.buildings.filter(b => b != this).length)]));
            }
        }, 200/Number(localStorage.getItem('timeSpeed')));

        window.addEventListener('storage', (e) => {
            if (e.key == 'timeSpeed') {
                clearInterval(this.vehicles_interval);
                this.vehicles_interval = setInterval(() => {
                    if (Math.random() > 0.9) {
                        this.map.playground.entities.addVehicle(new Car(this, this.map.buildings.filter(b => b != this)[Math.floor(Math.random() * this.map.buildings.filter(b => b != this).length)]));
                    }
                }, 200/Number(localStorage.getItem('timeSpeed')));
            }
        });
    }
}

/**
 * Parking class - An infrastructure where vehicles can be parked
 * @extends Infrastructure
 */
class Parking extends Building {
    /**
     * Parking - An infrastructure where vehicles can be parked
     * @param {object} position {x: int, y: int}
     * @param {object} size {x: int, y: int}
     * @param {int} capacity 
     */
    constructor(position, size, capacity) {
        super(position, size);
        this.capacity = capacity;
        this.vehicles = [];

        this.generated_vehicles = [Car];
    }

    /**
     * Draw parking on canvas
     * @param {HTMLCanvasElement} canvas 
     */
    draw(canvas) {
        this.scale = Number(localStorage.getItem('scale'));
        this.canvas_position = coordsToPixels(this.position, this.scale);
        this.canvas_size = { x: this.size.x * this.scale, y: this.size.y * this.scale };
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = 'src/assets/textures/parking3x3.svg';
        img.onload = () => {
            ctx.drawImage(img, this.canvas_position.x-this.scale, this.canvas_position.y-this.scale, this.canvas_size.x, this.canvas_size.y);
        }
    }

    /**
     * Add vehicle to parking
     * @param {Vehicle} vehicle 
     */
    addVehicle(vehicle) {
        if (this.vehicles.length < this.capacity) {
            this.vehicles.push(vehicle);
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

class Route extends Infrastructure {
    constructor(position) {
        super(position);
    }
}

/**
 * Road class - An infrastructure that connects buildings
 * @extends Infrastructure
 */
class Road extends Route {
    /**
     * Road - An infrastructure that connects buildings, cars can drive on it
     * @param {object} start {x: int, y: int}
     * @param {object} end {x: int, y: int}
     */
    constructor(start, end) {
        super(start);
        this.end = end;
        this.canvas_end = coordsToPixels(end, Number(localStorage.getItem('scale')));
        this.size = { x: 1, y: 1 }

        this.occupied_cells = [];
        for (let x = Math.min(this.position.x, this.end.x); x <= Math.max(this.end.x, this.position.x); x++) {
            for (let y = Math.min(this.position.y, this.end.y); y <= Math.max(this.end.y, this.position.y); y++) {
                this.occupied_cells.push({ x: x, y: y });
            }
        }
    }

    /**
     * Draw road on canvas
     * @param {HTMLCanvasElement} canvas 
     */
    draw(canvas) {
        this.scale = Number(localStorage.getItem('scale'));
        this.canvas_position = coordsToPixels(this.position, this.scale);
        this.canvas_end = coordsToPixels(this.end, this.scale);
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.lineWidth = Number(localStorage.getItem('scale'));
        ctx.moveTo(this.canvas_position.x - this.scale/2, this.canvas_position.y - this.scale/2);
        ctx.lineTo(this.canvas_end.x - this.scale/2, this.canvas_end.y - this.scale/2);
        ctx.stroke();
        ctx.fillRect(this.canvas_position.x - this.scale, this.canvas_position.y - this.scale, this.scale, this.scale);
        ctx.fillRect(this.canvas_end.x-this.scale, this.canvas_end.y-this.scale, this.scale, this.scale);
    }
}

/**
 * Junction class - An infrastructure that connects roads
 * @extends Infrastructure
 */
class Junction extends Route {
    /**
     * Junction - An infrastructure that connects roads
     * @param {object} position `{x: int, y: int}`
     */
    constructor(position) {
        super(position);
        this.occupied_cells = [{ x: this.position.x, y: this.position.y }];
        this.size = { x: 1, y: 1 }
    }

    /**
     * Draw junction on canvas
     * @param {HTMLCanvasElement} canvas 
     */
    draw(canvas) {
        this.scale = Number(localStorage.getItem('scale'));
        this.canvas_position = coordsToPixels(this.position, this.scale);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.fillRect(this.canvas_position.x - this.scale, this.canvas_position.y - this.scale, Number(localStorage.getItem('scale')), Number(localStorage.getItem('scale')));
    }
}

export { Map, Infrastructure, Building, Parking, Route, Road, Junction };