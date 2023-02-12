import Peas from "./Peas.js";

export default class Plante {
    constructor(x, y, cell, health, shooting , damage){
        this.x = x;
        this.y = y;
        this.width = cell;
        this.height = cell;
        this.health = health;
        this.shooting = shooting;
        this.damage = damage;
        this.clock = 0;
        this.peas = [];
    }

    draw(ctx){
        ctx.save();
        ctx.fillStyle="black";
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fillStyle = 'white';
        ctx.font = "20px Arial";
        ctx.fillText(this.health, this.x + 30,this.y +30 );
        ctx.restore();        
    }

    addPeas(){
        this.clock ++;
        if(this.clock == 150){
            this.peas.push(new Peas(this.x, this.y));
            this.clock = 0;
        }
    }
}