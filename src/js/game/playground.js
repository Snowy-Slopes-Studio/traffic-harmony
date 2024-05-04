import { Entities } from './vehicles.js';
import { Background } from './background.js';
import { Map } from './infras.js';
import { UI} from './ui.js';

/**
 * Playground class
 */
class Playground {
    /**
     * Playground
     * @param {HTMLElement} playground
     */
    constructor(playground) {
        this.vehicles = [];
        this.buildings = [];
        this.roads = [];

        this.canvas = playground;

        this.canvas.addEventListener('click', (e) => {
        });

        this.background = new Background(playground.querySelector('#background'), this);
        this.map = new Map(playground.querySelector('#map'), this);
        this.entities = new Entities(playground.querySelector('#entities'), this);
        this.ui = new UI(playground.querySelector('#ui'), this);

        this.layers = [this.background, this.map, this.entities, this.ui];

        this.entities.layers = this.layers;

        this.scale = localStorage.getItem('scale');

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
}

export { Playground };