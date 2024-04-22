class Entities {
    constructor(canvas) {
        this.canvas = canvas;

        this.vehicles = [];

        this.resize();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.redraw();
    }
    redraw() {
        this.vehicles.forEach(vehicle => vehicle.draw(this.entities));
    }

    // Vehicles
    addVehicle(vehicle) {
        this.vehicles.push(vehicle);
        vehicle.draw(this.entities);
    }
    removeVehicle(vehicle) {
        this.vehicles = this.vehicles.filter(v => v.id != vehicle.id);
        this.redrawEntities();
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
 * @param {Object} start object `{x: int, y: int}`
 * @param {Object} end object `{x: int, y: int}`
 * @param {Boolean} visible boolean (default = `true`)
 */
class Vehicle {
    constructor(position, start, end, visible = true) {
        this.id = Math.random().toString(36).substr(2, 9);
        this.position = position;
        this.speed = 1;
        this.start = start;
        this.end = end;
        this.visible = visible;
        this.moving = false;
    }

    /**
     * Draw vehicle
     * @param {*} canva HTMLCanvasElement
     */
    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

}

export { Entities, Vehicle };