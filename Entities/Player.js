//Player.js
import { Entity } from "./Entity.js";

export var Player = Entity.extend(function(){
  this.sprite={
    img:"",
    imgURL:"assets/characters/player.png",
    sourceX:0,
	  sourceY:0,
    sourceWidth:32,
    sourceHeight:48
    };
  this.x=160;
  this.y=128;
  this.width= 16;
  this.height= 24;
  this.speed= 1;
  this.numberOfFrames= 4;
  this.currentFrame= 0;
  this.states= {
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3
    };
  this.state= 0;
  this.animationCounter= 0;
  this.animationSpeed= 8;
  
  this.constructor= function(){};

  this.updateAnimation= function() {
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
            this.animationCounter = 0;
        }
        this.sprite.sourceX = this.currentFrame * this.sprite.sourceWidth;
        this.sprite.sourceY = this.state * this.sprite.sourceHeight;

};
});


export default class Player {
    constructor(x, y, speed) {
        this.sprite = {
            sourceX: 0,
            sourceY: 0,
            width: 48,
            height: 64
        };
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.width = 24;
        this.height = 32;
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

    updateAnimation(renderCallback) {
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
            this.sprite.sourceX = this.currentFrame * this.sprite.width;
            this.sprite.sourceY = this.state * this.sprite.height;
            this.animationCounter = 0; // reset contador
        }
        if (renderCallback) {
            renderCallback(); // Chama a função de renderização fornecida
        }
    }
}