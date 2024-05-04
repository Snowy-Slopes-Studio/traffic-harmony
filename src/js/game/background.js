import { Layer } from "./layers.js";

class Background extends Layer {
    constructor(canvas, playground) {
        super(canvas, playground);

        this.scale = Number(localStorage.getItem('scale'));

        this.resize();
        window.addEventListener('storage', (e) => {
            if (e.key == 'showGrid') {
                this.redraw();
            }
        });
    }

    redraw() {
        this.clear();
        this.scale = Number(localStorage.getItem('scale'));
        if (localStorage.getItem('showGrid') == 'true') { this.showGrid(); }
    }

    // Grid
    showGrid() {
        const ctx = this.canvas.getContext('2d');
        for (let x = 0; x < this.canvas.width; x += this.scale) {
            ctx.beginPath();
            ctx.strokeStyle = '#B7B7B7';
            ctx.moveTo(x, 0);
            ctx.lineTo(x, this.canvas.height);
            ctx.stroke();
        }
        for (let y = 0; y < this.canvas.height; y += this.scale) {
            ctx.beginPath();
            ctx.strokeStyle = '#B7B7B7';
            ctx.moveTo(0, y);
            ctx.lineTo(this.canvas.width, y);
            ctx.stroke();
        }
    }
    
}

export { Background };