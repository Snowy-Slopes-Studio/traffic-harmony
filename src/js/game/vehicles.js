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

    draw(canva) {
        const ctx = canva.getContext('2d');
        ctx.fillStyle = 'red';
        ctx.arc(this.position.x, this.position.y, 5, 0, Math.PI * 2);
        ctx.fill();
    }

}

export { Vehicle };