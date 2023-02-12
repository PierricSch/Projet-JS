export default class Zombie {
    constructor(x, y, cell, speed, health ){
        this.x = x;
        this.y = y;
        this.width = cell;
        this.height = cell;
        this.health = health;
        this.speed = speed;
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle = "purple";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'black';
        ctx.font = "20px Arial";
        ctx.fillText(this.health, this.x + 30,this.y +30 );
        ctx.restore();        
    }

    move(){
        this.x -= this.speed;
    }
}