//NPC.js
import Entity from "./Entity.js";

var NPC = Entity.extend(function () {

    this.constructor = function (imgUrl, x, y) {
        this.super();

        this.sprite = {
            img: "",
            imgURL: imgUrl,
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 32,
            sourceHeight: 48
        };
        this.x = x;
        this.y = y;
        this.width = 16;
        this.height = 24;
    };

    this.update = function () {
    };
});

export default NPC