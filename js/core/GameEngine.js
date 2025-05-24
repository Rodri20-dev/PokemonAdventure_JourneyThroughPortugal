// js/core/GameEngine.js
import CollisionDetector from "./CollisionDetector.js";
import MovementHandler from "./MovementHandler.js";
import Player from "../entities/Player.js";
import SceneManager from "./SceneManager.js";
import World from "../entities/World.js";
import Battle from "./BattleSystem.js"

let playerTransitionLocation = '';
class GameEngine {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.world = new World();
        this.world.sprite.img = new Image();
        this.player = new Player();
        this.player.sprite.img = new Image();
        this.collisionDetector = null;
        this.movementHandler = new MovementHandler(this.player);
        this.assetsLoaded = 0;
        this.sceneManager = new SceneManager(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.battle = new Battle(this.canvas, this.ctx)
        this.battleView = false
        this.lastMap
    }

    start() {
        this.loadMap('map'); // Carrega o mapa inicial

        this.keydownHandler = this.movementHandler.handleKeyDown.bind(this.movementHandler);
        this.keyupHandler = this.movementHandler.handleKeyUp.bind(this.movementHandler);

        window.addEventListener("keydown", this.keydownHandler);
        window.addEventListener("keyup", this.keyupHandler);
    }

    async loadMap(mapName) {
        let world = this.world
        this.lastMap = mapName
        this.sceneManager.clearTransitionAreas();

        const res = await fetch(`../../data/${mapName}-data.json`);
        const data = await res.json();
        world.data = data;

        this.collisionDetector = new CollisionDetector(world.data);

        // remover listeners antigos
        world.sprite.img.removeEventListener("load", this.checkAssetsLoaded.bind(this));
        this.player.sprite.img.removeEventListener("load", this.checkAssetsLoaded.bind(this));

        if (this.assetsLoaded <= 2) {
            world.sprite.img.addEventListener("load", this.checkAssetsLoaded.bind(this));
            this.player.sprite.img.addEventListener("load", this.checkAssetsLoaded.bind(this));
        }


        world.sprite.img.src = `assets/images/maps/${mapName}.png`;
        this.player.sprite.img.src = this.player.sprite.imgURL;

        this.defineMapTransitionAreas(mapName);
        console.log("loadMap function called with:", mapName);

    }

    defineMapTransitionAreas(mapName) {
        // Mapa 1
        if (mapName === 'map') {

            if (playerTransitionLocation === 'map') {
                console.log("1");
                this.player.x = 3 * 16;
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
        if (!this.battleView) {
            this.update();
            this.render();

        }
        else {
            this.battleView = !this.battle.isBattleOver()
        }

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

        if (activeKey) this.player.update()


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

        // --- Highlight na grama e batalha aleatória ---
        if (this.world.data && this.world.data.layers && this.world.data.layers[0]) {
            const tileX = Math.floor(this.player.x / this.world.data.tilewidth);
            const tileY = Math.floor(this.player.y / this.world.data.tileheight);
            const tileIndex = tileY * this.world.data.width + tileX;
            const tileId = this.world.data.layers[0].data[tileIndex];

            console.log(tileId)
            const tilesets = this.world.data.tilesets;
            let isGrass = false;

            for (let tileset of tilesets) {
                const firstGid = tileset.firstgid;
                const tileCount = tileset.tilecount || (tileset.imagewidth / tileset.tilewidth) * (tileset.imageheight / tileset.tileheight);

                if (tileId >= firstGid && tileId < firstGid + tileCount) {
                    const localId = tileId - firstGid;
                    const tile = tileset.tiles?.find(t => t.id === localId);
                    if (tile && tile.properties) {
                        const grassProp = tile.properties.find(p => p.name === "isGrass" && p.value === true);
                        if (grassProp) {
                            isGrass = true;
                            break;
                        }
                    }
                }
            }

            if (isGrass) {
                this.isOnGrass = true;
                this.grassTilePos = { x: tileX, y: tileY };

                if (Math.random() < 0.01) {
                    this.startBattle();
                }
            } else {
                this.isOnGrass = false;
                this.grassTilePos = null;
            }

        }
    }

    render() {
        let world = this.world
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const camX = this.player.x - this.canvas.width / 2;
        const camY = this.player.y - this.canvas.height / 2;

        if (world.sprite.img && world.data) {
            this.ctx.drawImage(
                world.sprite.img,
                -camX, -camY,
                world.data.width * world.data.tilewidth,
                world.data.height * world.data.tileheight
            );
        }

        // Highlight na grama
        if (this.isOnGrass && this.grassTilePos) {
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)";
            this.ctx.fillRect(
                (this.grassTilePos.x * this.world.data.tilewidth) - camX,
                (this.grassTilePos.y * this.world.data.tileheight) - camY,
                this.world.data.tilewidth,
                this.world.data.tileheight
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

    startBattle() {
        console.log("Batalha iniciada!");
        this.ctx.save()
        this.battleView = true
        // Aqui você pode chamar sua lógica de batalha, troca de cena, etc
        this.battle.loadPokemonData()
        
    }

}

export default GameEngine;