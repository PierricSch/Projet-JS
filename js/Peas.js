export default class Peas {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 20;
        this.damage = 20
        this.speed = 2;
    }

    draw(ctx){
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x +50,this.y + 50,this.height,0, Math.PI * 2)
        ctx.fillStyle = "green";
        ctx.fill();
        ctx.restore();
    }

    move(){
        this.x += this.speed;
    }


}