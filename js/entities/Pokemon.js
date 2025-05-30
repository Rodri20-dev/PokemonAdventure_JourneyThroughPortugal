//Pokemon.js
import Entity from "./Entity.js";

var Pokemon = Entity.extend(function () {

    this.constructor = function (pName, hp, attack, imgFront, imgBack) {
        this.super();

        this.sprite = {
            img: "",
            imgFront: imgFront,
            imgBack: imgBack,
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 96,
            sourceHeight: 96
        };
        this.name = pName;
        this.maxHp = hp;
        this.hp = hp;
        this.attack = attack;
    };

    this.isAlive = function () {
        return this.hp > 0;
    };

    this.update= function(){
 
   };
});

export default Pokemon