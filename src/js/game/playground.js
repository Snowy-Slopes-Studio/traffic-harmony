class Playground {
    constructor(canva) {
        this.canva = canva;
        this.vehicles = [];
        this.infras = [];

        if (localStorage.getItem('showGrid') == 'true') { this.showGrid(); }
        else { this.hideGrid(); }

        window.addEventListener('storage', (e) => {
            if (e.key == 'showGrid') {
                this.redraw();
            }
        });

        
        canva.width = window.innerWidth;
        canva.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canva.width = window.innerWidth;
            canva.height = window.innerHeight;
            this.redraw();
        });
    }

    // Draw
    redraw() {
        this.hideGrid();
        if (localStorage.getItem('showGrid') == 'true') { this.showGrid(); }
        this.vehicles.forEach(vehicle => vehicle.draw(this.canva));
        this.infras.forEach(infra => infra.draw(this.canva));
    }
    clear() {
        const ctx = this.canva.getContext('2d');
        ctx.clearRect(0, 0, this.canva.width, this.canva.height);
    }

    // Grid
    showGrid() {
        const ctx = this.canva.getContext('2d');
        const svg = new Image();
        svg.src = 'src/assets/textures/grid.svg';
        svg.onload = () => {
            const pattern = ctx.createPattern(svg, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(0, 0, this.canva.width, this.canva.height);
        }
    }
    hideGrid() {
        const ctx = this.canva.getContext('2d');
        ctx.clearRect(0, 0, this.canva.width, this.canva.height);
        console.log('hideGrid');
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

    // Vehicles
    addVehicle(vehicle) {
        this.vehicles.push(vehicle);
        vehicle.draw(this.canva);
    }
    getVehicles() {
        return this.vehicles;
    }
    clearVehicles() {
        this.vehicles = [];
    }

    // Infrastructures
    addInfra(infra) {
        this.infras.push(infra);
        infra.draw(this.canva);
    }
    getInfras() {
        return this.infras;
    }
    clearInfras() {
        this.infras = [];
    }
}

export { Playground };