import { Entities } from './vehicles.js';
import { Background } from './background.js';
import { Map } from './infras.js';
import { UI} from './ui.js';

class Playground {
    constructor(playground) {
        this.vehicles = [];
        this.buildings = [];
        this.roads = [];

        this.background = new Background(playground.querySelector('#background'));
        this.map = new Map(playground.querySelector('#map'));
        this.entities = new Entities(playground.querySelector('#entities'));
        this.ui = new UI(playground.querySelector('#ui'));

        this.layers = [this.background, this.map, this.entities, this.ui];

        // console.log(this.background, this.map, this.entities, this.ui);

        this.redraw();

        window.addEventListener('resize', () => { this.resize(); });
    }

    resize() {
        this.layers.forEach(layer => {
            layer.resize();
            layer.redraw();
        });
    }

    // Draw
    redraw() {
        this.layers.forEach(layer => {
            layer.redraw();
        });
    }

    // Animation
    play() {
        this.vehicles.forEach(vehicle => {
            vehicle.move();
            this.redraw();
        });
    }

    pause() {
        this.vehicles.forEach(vehicle => {
            vehicle.stop();
        });
    }
}

export { Playground };