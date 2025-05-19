//Pokemon.js
import Entity from "./Entity.js";

var Pokemon = Entity.extend(function () {

    this.constructor = function (pName, hp, attack, imgUrl) {
        this.super();

        this.sprite = {
            img: "",
            imgURL: imgUrl,
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 32,
            sourceHeight: 48
        };
        this.name = pName;
        this.maxHp = hp;
        this.hp = hp;
        this.attack = attack;
    };

    this.isAlive = function () {
        return this.hp > 0;
    };
});

export default Pokemon