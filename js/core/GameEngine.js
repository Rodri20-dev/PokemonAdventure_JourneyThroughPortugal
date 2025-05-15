// js/core/GameEngine.js
import CollisionDetector from "./CollisionDetector.js";
import InputHandler from "./InputHandler.js";
import Player from "../entities/Player.js";
import SceneManager from "./SceneManager.js"; // Importa SceneManager

class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.mapData = null;
        this.mapImg = new Image();
        this.player = new Player();
        this.player.sprite.img = new Image();
        this.collisionDetector = null;
        this.inputHandler = new InputHandler(this.player);
        this.assetsLoaded = 0;
        this.sceneManager = new SceneManager(this); // Cria instância do SceneManager

        this.gameLoop = this.gameLoop.bind(this);
    }

    start() {
        this.loadMap('pallet-town'); // Carrega o mapa inicial
        window.addEventListener("keydown", this.inputHandler.handleKeyDown.bind(this.inputHandler));
        window.addEventListener("keyup", this.inputHandler.handleKeyUp.bind(this.inputHandler));

        // Define as áreas de transição (exemplo)
        this.sceneManager.addTransitionArea(400, 50, 32, 35, 'map2-data');
        this.sceneManager.addTransitionArea(400, 470, 32, 32, 'route22');

        this.gameLoop();
    }

    async loadMap(mapName) {
        console.log("loadMap function called with:", mapName);
        this.assetsLoaded = 0; // Reset assets loaded
        const res = await fetch(`../../data/${mapName}.json`); // Assumindo ficheiros .json para os mapas
        const data = await res.json();
        this.mapData = data;
        // console.log(this.mapData);
        this.collisionDetector = new CollisionDetector(this.mapData);

        this.mapImg.removeEventListener("load", this.checkAssetsLoaded); // Remove listeners antigos
        this.player.sprite.img.removeEventListener("load", this.checkAssetsLoaded);

        this.mapImg = new Image();
        this.player.sprite.img = new Image();

        this.mapImg.addEventListener("load", this.checkAssetsLoaded.bind(this));
        this.player.sprite.img.addEventListener("load", this.checkAssetsLoaded.bind(this));

        this.mapImg.src = `assets/images/maps/${mapName}.png`;
        this.player.sprite.img.src = this.player.sprite.imgURL;
    }

    checkAssetsLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === 2) {
            // Assets do mapa carregados
        }
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop);
    }

    update() {
        const activeKey = this.inputHandler.getActiveKey();
        let newX = this.player.x;
        let newY = this.player.y;

        if (activeKey === "ArrowUp") newY -= this.player.speed;
        else if (activeKey === "ArrowDown") newY += this.player.speed;
        else if (activeKey === "ArrowLeft") newX -= this.player.speed;
        else if (activeKey === "ArrowRight") newX += this.player.speed;

        if (activeKey) this.player.updateAnimation();

        if (this.collisionDetector) {
            if (!this.collisionDetector.isColliding(newX, this.player.y, this.player.width, this.player.height)) this.player.x = newX;
            if (!this.collisionDetector.isColliding(this.player.x, newY, this.player.width, this.player.height)) this.player.y = newY;
        }

        this.sceneManager.checkTransitionAreas(this.player.x, this.player.y);
        this.sceneManager.updateTransition();
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

        this.ctx.drawImage(
            this.player.sprite.img,
            this.player.sprite.sourceX, this.player.sprite.sourceY,
            this.player.sprite.sourceWidth, this.player.sprite.sourceHeight,
            (this.canvas.width - this.player.width) / 2,
            (this.canvas.height - this.player.height) / 2,
            this.player.width, this.player.height
        );

        // Desenha a primeira área de transição AJUSTADA PARA A CÂMARA
        this.ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
        this.ctx.fillRect(400 - camX, 50 - camY, 32, 35);

        // Desenha a segunda área de transição AJUSTADA PARA A CÂMARA
        this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        this.ctx.fillRect(400 - camX, 470 - camY, 32, 32);

        this.sceneManager.renderTransition();
    }
}

export default GameEngine;