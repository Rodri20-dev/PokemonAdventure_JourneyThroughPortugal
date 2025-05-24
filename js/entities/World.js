//Player.js
import Entity from "./Entity.js";

var World = Entity.extend(function () {

    this.constructor = function () {
        this.super();

        this.sprite = {
            img: "",
            imgURL: "",
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 0,
            sourceHeight: 0
        };
        this.data = null
        this.x = 0;
        this.y = 0;
        // this.width = 16;
        // this.height = 24;
    };

    this.update= function(){
 
   };

});

export default World