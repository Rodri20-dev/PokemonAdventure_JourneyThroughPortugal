//NPC.js
import Entity from "./Entity.js";

var NPC = Entity.extend(function () {

    this.constructor = function (x, y) {
        this.super();

        this.sprite = {
            img: "",
            imgURL: "assets/images/characters/npc.png",
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 16,
            sourceHeight: 24
        };
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 24;
        this.pokemons = []
    };

    this.update = function () {
    };
});

export default NPC