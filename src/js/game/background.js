class Background {
    constructor(canvas) {
        this.canvas = canvas;

        this.resize();
        window.addEventListener('storage', (e) => {
            if (e.key == 'showGrid') {
                this.redraw();
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        // this.redraw();
    }
    redraw() {
        this.hideGrid();
        if (localStorage.getItem('showGrid') == 'true') { this.showGrid(); }
    }

    // Grid
    showGrid() {
        const ctx = this.canvas.getContext('2d');
        const svg = new Image();
        svg.src = 'src/assets/textures/grid.svg';
        svg.onload = () => {
            const pattern = ctx.createPattern(svg, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    hideGrid() {
        const ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export { Background };