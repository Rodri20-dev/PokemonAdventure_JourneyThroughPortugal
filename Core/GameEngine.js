import CollisionDetector from "./CollisionDetector.js";
import InputHandler from "./InputHandler.js";
import { Player } from "../Entities/Player.js"; // Importa Player com chaves

export default class GameEngine {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.mapData = null;
        this.mapImg = new Image();
        this.player = new Player(); // Cria uma instância de Player
        this.collisionDetector = null;
        this.inputHandler = new InputHandler(this.player); // Passa o player para o InputHandler
        this.assetsLoaded = 0;
    }

    load() {
        this.mapData = TileMaps["map-data"];
        this.collisionDetector = new CollisionDetector(this.mapData);

        this.mapImg.addEventListener("load", this.checkAssetsLoaded.bind(this));
        this.player.sprite.img = new Image();
        this.player.sprite.img.addEventListener("load", this.checkAssetsLoaded.bind(this));

        this.mapImg.src = 'assets/maps/pallet-town.png';
        this.player.sprite.img.src = this.player.sprite.imgURL;
    }

    checkAssetsLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === 2) {
            this.gameLoop();
        }
    }

    handleKeyDown(e) {
        this.inputHandler.handleKeyDown(e);
    }

    handleKeyUp(e) {
        this.inputHandler.handleKeyUp(e);
    }

    update() {
        const activeKey = this.inputHandler.getActiveKey();
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

        if (activeKey) {
            this.player.updateAnimation();
        }

        if (this.collisionDetector) {
            if (!this.collisionDetector.isColliding(newX, this.player.y, this.player.width, this.player.height)) {
                this.player.x = newX;
            }
            if (!this.collisionDetector.isColliding(this.player.x, newY, this.player.width, this.player.height)) {
                this.player.y = newY;
            }
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
            this.player.sprite.img,
            this.player.sprite.sourceX, this.player.sprite.sourceY, this.player.sprite.sourceWidth, this.player.sprite.sourceHeight,
            dx, dy, this.player.width, this.player.height
        );
    }

    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    start() {
        this.load();
    }
}