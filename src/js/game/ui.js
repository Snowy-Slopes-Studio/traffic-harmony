import { columnToLetters } from "../lib/MRLib/coords.js";

import { Layer } from './layers.js';


class UI extends Layer {
    constructor(canvas, playground) {
        super(canvas, playground);

        this.ui = [new GridCoords()];

        this.resize();

        window.addEventListener('resize', () => { this.resize(); });

        window.addEventListener('storage', (e) => { if (e.key == 'showGridCoords') { this.redraw(); } });
        window.addEventListener('storage', (e) => { if (e.key == 'coordsSystem') { this.redraw(); } });
    }

    redraw() {
        this.clear();
        this.ui.forEach(element => element.redraw(this.canvas));
    }
}

class GridCoords {
    constructor() {
    }

    redraw(canvas) {
        if (localStorage.getItem('showGridCoords') != 'true') { return; }
        const ctx = canvas.getContext('2d');
        for (let x = 1; x < canvas.width/Number(localStorage.getItem('scale')); x += 1) {
            ctx.fillStyle = '#8D8D8D';
            ctx.font = `${.5*Number(localStorage.getItem('scale'))}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            if (localStorage.getItem('coordsSystem') == 'alphaNumeric') {
                ctx.fillText(`${columnToLetters(x)}`, (x+.5)*Number(localStorage.getItem('scale')), 11);
            } else if (localStorage.getItem('coordsSystem') == 'numeric') {
                ctx.fillText(`${x}`, (x+.5)*Number(localStorage.getItem('scale')), 0.55*Number(localStorage.getItem('scale')));
            }
        }
        for (let y = 1; y < canvas.height/Number(localStorage.getItem('scale')); y += 1) {
            ctx.fillStyle = '#8D8D8D';
            ctx.font = `${.5*Number(localStorage.getItem('scale'))}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${y}`, 0.55*Number(localStorage.getItem('scale')), (y+.5)*Number(localStorage.getItem('scale')));
        }
    }
        
}

export { UI };