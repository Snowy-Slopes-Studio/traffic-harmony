import { columnToLetters } from "../lib/MRLib/coords.js";

class UI {
    constructor(canvas) {
        this.canvas = canvas;

        this.ui = [new GridCoords()];

        this.resize();

        window.addEventListener('resize', () => { this.resize(); });

        window.addEventListener('storage', (e) => { if (e.key == 'showGridCoords') { this.redraw(); } });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.redraw();
    }
    redraw() {
        this.ui.forEach(element => element.redraw(this.canvas));
    }
}

class GridCoords {
    constructor() {
    }

    redraw(canvas) {
        if (localStorage.getItem('showGridCoords') != 'true') { return; }
        const ctx = canvas.getContext('2d');
        for (let x = 1; x < canvas.width/20; x += 1) {
            ctx.fillStyle = '#8D8D8D';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${columnToLetters(x)}`, x*20+10, 11);
        }
        for (let y = 1; y < canvas.height/20; y += 1) {
            ctx.fillStyle = '#8D8D8D';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${y}`, 11, y*20+10);
        }
    }
        
}

export { UI };