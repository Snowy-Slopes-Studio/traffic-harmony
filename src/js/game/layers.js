/**
 * Layer class
 */
class Layer {
    /**
     * Layer
     * @param {HTMLCanvasElement} canvas 
     */
    constructor(canvas, playground) {
        this.canvas = canvas;
        this.playground = playground;
        this.scale = localStorage.getItem('scale');

        window.addEventListener('storage', (e) => { if (e.key == 'scale') {
            this.scale = Number(localStorage.getItem('scale'));
            this.redraw();
        }});
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.redraw();
    }
    clear() {
        this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Layer };