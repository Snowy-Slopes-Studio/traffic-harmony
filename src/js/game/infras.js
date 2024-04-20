class Infrastructure {
    constructor(position) {
        this.position = position;
        this.connections = [];
    }

    connectTo(infra, position = this.position) {
        this.connections.push(new Connection(this, infra, position));
    }
}

class Connection {
    constructor(from, to, position) {
        this.from = from;
        this.to = to;
        this.position = position;
    }
}

class Parking extends Infrastructure {
    constructor(position, size, capacity) {
        super(position);
        this.size = size;
        this.capacity = capacity;
        this.vehicles = [];
    }

    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.fillStyle = 'blue';
        ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    }

    addVehicle(vehicle) {
        if (this.vehicles.length < this.capacity) {
            this.vehicles.push(vehicle);
            vehicle.position = this.position;
        }
        else {
            console.log('Parking is full');
        }
    }

    removeVehicle(vehicle) {
        const index = this.vehicles.indexOf(vehicle);
        if (index > -1) {
            this.vehicles.splice(index, 1);
        }
    }
}

class Road extends Infrastructure {
    constructor(start, end) {
        super(start);
        this.end = end;
    }

    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.lineWidth = 20;
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
    }
}

export { Parking, Road };