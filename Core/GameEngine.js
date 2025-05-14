import CollisionDetector from "./ColisionDetector.js";
import InputHandler from "./InputHandler.js";
import Player from "../Entities/Player.js"; // Importa a classe Player

export default class GameEngine {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.mapData = null;
        this.mapImg = new Image();
        this.playerImg = new Image();
        this.player = new Player(160, 128, 1); // Cria uma instância de Player
        this.collisionDetector = null;
        this.inputHandler = null;
        this.assetsLoaded = 0;
    }

    load() {
        // Dados do mapa já carregados globalmente por map-data.js
        this.mapData = TileMaps["map-data"];
        this.collisionDetector = new CollisionDetector(this.mapData);
        this.inputHandler = new InputHandler(this.player);

        this.mapImg.addEventListener("load", this.checkAssetsLoaded.bind(this));
        this.playerImg.addEventListener("load", this.checkAssetsLoaded.bind(this));

        this.mapImg.src = 'assets/maps/pallet-town.png';
        this.playerImg.src = 'assets/characters/player.png';
    }

    checkAssetsLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === 2) {
            this.gameLoop();
        }
    }

    update() {
        let newX = this.player.x;
        let newY = this.player.y;
        const activeKey = this.inputHandler.getActiveKey();

        if (activeKey === "ArrowUp") {
            newY -= this.player.speed;
            this.player.state = this.player.states.UP;
        }
        if (activeKey === "ArrowDown") {
            newY += this.player.speed;
            this.player.state = this.player.states.DOWN;
        }
        if (activeKey === "ArrowLeft") {
            newX -= this.player.speed;
            this.player.state = this.player.states.LEFT;
        }
        if (activeKey === "ArrowRight") {
            newX += this.player.speed;
            this.player.state = this.player.states.RIGHT;
        }

        // Verifica a colisão usando a instância collisionDetector
        if (this.collisionDetector) {
            if (!this.collisionDetector.isColliding(newX, this.player.y)) this.player.x = newX;
            if (!this.collisionDetector.isColliding(this.player.x, newY)) this.player.y = newY;
        }

        if (activeKey) {
            this.player.updateAnimation(this.render.bind(this)); // Passa a função render para o Player
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const camX = this.player.x - this.canvas.width / 2;
        const camY = this.player.y - this.canvas.height / 2;

        this.ctx.drawImage(
            this.mapImg,
            -camX, -camY,
            this.mapData.width * this.mapData.tilewidth,
            this.mapData.height * this.mapData.tileheight
        );

        const dx = (this.canvas.width - this.player.width) / 2;
        const dy = (this.canvas.height - this.player.height) / 2;
        this.ctx.drawImage(
            this.playerImg,
            this.player.sprite.sourceX, this.player.sprite.sourceY, this.player.sprite.width, this.player.sprite.height,
            dx, dy, this.player.width, this.player.height
        );
    }

    gameLoop() {
        this.update();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    start() {
        this.load();
    }
}