// js/core/GameEngine.js
import CollisionDetector from "./CollisionDetector.js";
import MovementHandler from "./MovementHandler.js";
import Player from "../entities/Player.js";
import SceneManager from "./SceneManager.js";

let playerTransitionLocation = '';
class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.mapData = null;
        this.mapImg = new Image();
        this.player = new Player();
        this.player.sprite.img = new Image();
        this.collisionDetector = null;
        this.movementHandler = new MovementHandler(this.player);
        this.assetsLoaded = 0;
        this.sceneManager = new SceneManager(this);
        this.gameLoop = this.gameLoop.bind(this);
    }

    start() {
        this.loadMap('map'); // Carrega o mapa inicial

        this.keydownHandler = this.movementHandler.handleKeyDown.bind(this.movementHandler);
        this.keyupHandler = this.movementHandler.handleKeyUp.bind(this.movementHandler);

        window.addEventListener("keydown", this.keydownHandler);
        window.addEventListener("keyup", this.keyupHandler);
    }

    async loadMap(mapName) {
        this.sceneManager.clearTransitionAreas();
        console.log("loadMap function called with:", mapName);
        // this.assetsLoaded = 0; // Reset assets loaded
        const res = await fetch(`../../data/${mapName}-data.json`);
        const data = await res.json();
        this.mapData = data;
        // console.log(this.mapData);
        this.collisionDetector = new CollisionDetector(this.mapData);

        // remover listeners antigos
        this.mapImg.removeEventListener("load", this.checkAssetsLoaded.bind(this));
        this.player.sprite.img.removeEventListener("load", this.checkAssetsLoaded.bind(this));

        if (this.assetsLoaded <= 2) {
            this.mapImg.addEventListener("load", this.checkAssetsLoaded.bind(this));
            this.player.sprite.img.addEventListener("load", this.checkAssetsLoaded.bind(this));
        }


        this.mapImg.src = `assets/images/maps/${mapName}.png`;
        this.player.sprite.img.src = this.player.sprite.imgURL;

        this.defineMapTransitionAreas(mapName);
    }

    defineMapTransitionAreas(mapName) {
        // Mapa 1
        if (mapName === 'map') {

            if (playerTransitionLocation === 'map') {
                console.log("1");
                this.player.x = 9 * 16;
                this.player.y = 17 * 16;
            }

            playerTransitionLocation = 'map2';

            //Transição do MAPA 1 para o MAPA 2
            this.sceneManager.addTransitionArea(0, 17, 1, 2, 'map2');

            // Mapa 2 
        } else if (mapName === 'map2') {
            if (playerTransitionLocation === 'map2') {
                console.log("2");

                console.log(playerTransitionLocation);
                this.player.x = 45 * 16;
                this.player.y = 100;
            }

            playerTransitionLocation = 'map';

            //Transição do MAPA 2 para o MAPA 1
            this.sceneManager.addTransitionArea(47, 6, 1, 4, 'map');

        }
    }

    checkAssetsLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === 2) {
            this.gameLoop()
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop);
    }

    update() {
        const activeKey = this.movementHandler.getActiveKey();
        let newX = this.player.x;
        let newY = this.player.y;

        if (activeKey === "ArrowUp") {
            newY -= this.player.speed;
            this.player.state = this.player.states.UP;
        } else if (activeKey === "ArrowDown") {
            newY += this.player.speed;
            this.player.state = this.player.states.DOWN;
        } else if (activeKey === "ArrowLeft") {
            newX -= this.player.speed;
            this.player.state = this.player.states.LEFT;
        } else if (activeKey === "ArrowRight") {
            newX += this.player.speed;
            this.player.state = this.player.states.RIGHT;
        }

        if (activeKey)  this.player.updateAnimation()


        if (this.collisionDetector) {
            if (!this.collisionDetector.isColliding(newX, this.player.y, this.player.height)) {
                this.player.x = newX;
            }
            if (!this.collisionDetector.isColliding(this.player.x, newY, this.player.height)) {
                this.player.y = newY;
            }
        }

        this.sceneManager.checkTransitionAreas(this.player.x, this.player.y);
        this.sceneManager.updateTransition()
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const camX = this.player.x - this.canvas.width / 2;
        const camY = this.player.y - this.canvas.height / 2;

        if (this.mapImg && this.mapData) {
            this.ctx.drawImage(
                this.mapImg,
                -camX, -camY,
                this.mapData.width * this.mapData.tilewidth,
                this.mapData.height * this.mapData.tileheight
            );
        }

        const dx = (this.canvas.width - this.player.width) / 2;
        const dy = (this.canvas.height - this.player.height) / 2;
        this.ctx.drawImage(
            this.player.sprite.img,
            this.player.sprite.sourceX, this.player.sprite.sourceY,
            this.player.sprite.sourceWidth, this.player.sprite.sourceHeight,
            dx, dy, this.player.width, this.player.height
        );

        // Desenha a primeira área de transição AJUSTADA PARA A CÂMARA

        this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";

        this.ctx.fillRect((0 * 16) - camX, (17 * 16) - camY, 16, 32);



        // Desenha a segunda área de transição AJUSTADA PARA A CÂMARA

        this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";

        this.ctx.fillRect((47 * 16) - camX, (6 * 16) - camY, 16, 64);

        this.sceneManager.renderTransition();
    }
}

export default GameEngine;