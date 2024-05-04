import { coordsToPixels } from "../lib/MRLib/coords.js";

import { Layer } from "./layers.js";
import { Infrastructure, Building } from "./infras.js";
import { getRelationGraph, getShortestRoute, setPathInTheRightWay } from "./pathfinding.js";

class Entities extends Layer {
    constructor(canvas, playground) {
        super(canvas, playground);

        this.vehicles = [];

        this.resize();

        window.requestAnimationFrame(() => { this.redraw(); });

        setInterval(() => {
            this.vehicles.forEach(vehicle => {
                if ((vehicle.step < vehicle.path.length) && (Math.abs(vehicle.position.x - vehicle.path[vehicle.step].x) > .1 || Math.abs(vehicle.position.y - vehicle.path[vehicle.step].y) > .1)) {
                    vehicle.move(vehicle.path[vehicle.step]);
                }
                else if (vehicle.step < vehicle.path.length) {
                    vehicle.step++;
                }
                else {
                    this.removeVehicle(vehicle);
                }
                this.redraw();
            });
        }, Number(localStorage.getItem('timeStep')));
    }

    redraw() {
        this.clear();
        if (localStorage.getItem('showVehicles') == 'true') {
            this.vehicles.forEach(vehicle => vehicle.draw(this.canvas));
        }
    }

    // Vehicles
    addVehicle(vehicle) {
        this.vehicles.push(vehicle);
        vehicle.path = getShortestRoute(this.playground.map.relations, vehicle.start.id, vehicle.end.id);
        vehicle.path = vehicle.path.map(id => this.playground.map.getAllInfrastructures().find(b => b.id == id));
        vehicle.path = vehicle.path.map(step => step instanceof Building ? { x: step.position.x + step.size.x / 2 - .5, y: step.position.y + step.size.y / 2 -.5} : step.occupied_cells).flat();
        vehicle.path = setPathInTheRightWay(vehicle.path);
        vehicle.path = vehicle.path.map(coords => ({ x: coords.x - .5, y: coords.y - .5 }));
        vehicle.step = 0;
        vehicle.draw(this.canvas);
    }
    removeVehicle(vehicle) {
        this.vehicles = this.vehicles.filter(v => v.id != vehicle.id);
        this.redraw();
    }
    getVehicles() {
        return this.vehicles;
    }
    clearVehicles() {
        this.vehicles = [];
    }
}

/**
 * Vehicle class
 * @param {Object} position object `{x: int, y: int}`
 * @param {Infrastructure} start object `{x: int, y: int}`
 * @param {Infrastructure} end object `{x: int, y: int}`
 * @param {Boolean} visible boolean (default = `true`)
 */
class Vehicle {
    constructor(start, end, position = null, visible = true) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.scale = Number(localStorage.getItem('scale'));
        this.position = position === null ? Object.assign({}, { x: start.position.x + start.size.x/2 - 1, y: start.position.y + start.size.y/2 - 1 }) : position;
        this.canvas_position = coordsToPixels(this.position, this.scale);

        this.start = start;
        this.end = end;

        this.speed = 1.5; // cells per second
        this.visible = visible;
        this.moving = true;

        window.addEventListener('storage', () => { if (localStorage.getItem('scale')) { this.scale = Number(localStorage.getItem('scale')); }});
    }
}

/**
 * Car class
 */
class Car extends Vehicle {
    /**
     * Create a car object - A vehicle that moves on the map
     * @param {Infrastructure} start
     * @param {Infrastructure} end
     * @param {object} [position=start.position] `{x: int, y: int}`
     * @param {boolean} [visible=true]
     */
    constructor(start, end, position = null, visible = true) {
        super(start, end, position, visible);
    }

    /**
     * Draw car on canvas
     * @param {*} canva HTMLCanvasElement
     */
    draw(canvas) {
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(this.canvas_position.x, this.canvas_position.y, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    move(goal) {
        this.direction = { x: goal.x - this.position.x, y: goal.y - this.position.y };
        this.direction = {
            x: this.direction.x / (this.direction.x**2 + this.direction.y**2)**.5,
            y: this.direction.y / (this.direction.x**2 + this.direction.y**2)**.5
        };
        this.position.x += this.direction.x * this.speed / (1000 / Number(localStorage.getItem('timeStep'))) * Number(localStorage.getItem('timeSpeed'));
        this.position.y += this.direction.y * this.speed / (1000 / Number(localStorage.getItem('timeStep'))) * Number(localStorage.getItem('timeSpeed'));
        this.canvas_position = coordsToPixels(this.position, this.scale);
    }
}

export { Entities, Vehicle, Car };