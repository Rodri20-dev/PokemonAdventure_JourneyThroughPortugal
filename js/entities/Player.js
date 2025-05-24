//Player.js
import Entity from "./Entity.js";

var Player = Entity.extend(function () {

    this.constructor = function () {
        this.super();

        this.sprite = {
            img: "",
            imgURL: "assets/images/characters/player.png",
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 32,
            sourceHeight: 48
        };
        this.x = 11*16 + 8;
        this.y = 8*16;
        this.width = 16;
        this.height = 24;
        this.speed = 4;
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
    };

    this.update = function () {
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
            this.animationCounter = 0;
        }
        this.sprite.sourceX = this.currentFrame * this.sprite.sourceWidth;
        this.sprite.sourceY = this.state * this.sprite.sourceHeight;

    };
    this.resetAnimation = function () {
        this.currentFrame = 0;
        this.animationCounter = 0;
        this.sprite.sourceX = 0;
    };

});

export default Player