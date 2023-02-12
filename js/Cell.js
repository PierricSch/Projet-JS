import { mousePos } from "./ecouteur.js";
import { rectsOverlap } from './collision.js';

export default class cell {
    constructor(x, y, cell){
        this.x = x;
        this.y = y;
        this.width = cell;
        this.height = cell;
    }

    draw(ctx){
        if(rectsOverlap(this, mousePos)){
            ctx.save();
            ctx.strokeStyle="black";
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.restore();
        }
    }
}