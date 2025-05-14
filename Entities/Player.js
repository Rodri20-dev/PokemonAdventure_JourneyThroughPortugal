//Player.js
import { Entity } from "./Entity.js";

export class Player extends Entity { // Exporta como uma classe ES6
    constructor(x = 160, y = 128, speed = 1) { // Adiciona valores por defeito
        super();
        this.sprite = {
            img: null,
            imgURL: "assets/characters/player.png",
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 32,
            sourceHeight: 48
        };
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 24;
        this.speed = speed;
        this.numberOfFrames = 4;
        this.currentFrame = 0;
        this.states = {
            DOWN: 0,
            LEFT: 1,
            RIGHT: 2,
            UP: 3
        };
        this.state = 0;
        this.animationCounter = 0;
        this.animationSpeed = 8;
    }

    updateAnimation() {
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
            this.animationCounter = 0;
        }
        this.sprite.sourceX = this.currentFrame * this.sprite.sourceWidth;
        this.sprite.sourceY = this.state * this.sprite.sourceHeight;
    }
}