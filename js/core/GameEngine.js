// js/core/GameEngine.js
import CollisionDetector from "./CollisionDetector.js";
import InputHandler from "./InputHandler.js";
import Player from "../entities/Player.js";
import SceneManager from "./SceneManager.js"; 
import Sounds from "./Sounds.js"; // Importa Sounds (se não estiver já importado)

let playerTransitionLocation = '';

class GameEngine {
    // NOVO: gameSounds é passado para o construtor
    constructor(canvas, gameSounds) { 
        this.canvas = canvas;
        this.ctx = this.canvas.getContext("2d");
        this.mapData = null;
        this.mapImg = new Image();
        // NOVO: Passa gameSounds para o Player
        this.player = new Player(gameSounds); 
        this.player.sprite.img = new Image();
        this.collisionDetector = null;
        this.inputHandler = new InputHandler(this.player);
        this.assetsLoaded = 0;
        this.sceneManager = new SceneManager(this); 
        this.gameSounds = gameSounds; // Guarda a referência para usar (se necessário aqui, mas a lógica da música é na main)

        this.gameLoopStarted = false; // Flag para garantir que o gameLoop só começa uma vez

        this.gameLoop = this.gameLoop.bind(this);
    }

    start() {
        this.loadMap('map'); // Carrega o mapa inicial
        
        this.keydownHandler = this.inputHandler.handleKeyDown.bind(this.inputHandler);
        this.keyupHandler = this.inputHandler.handleKeyUp.bind(this.inputHandler);

        window.addEventListener("keydown", this.keydownHandler);
        window.addEventListener("keyup", this.keyupHandler);

        // A área de transição será definida em defineMapTransitionAreas
    }

    async loadMap(mapName) {
        this.sceneManager.clearTransitionAreas();
        console.log("loadMap function called with:", mapName);
        
        try {
            const res = await fetch(`../../data/${mapName}-data.json`); 
            if (!res.ok) {
                throw new Error(`Failed to load map data: ${res.statusText}`);
            }
            const data = await res.json();
            this.mapData = data;
            
            this.collisionDetector = new CollisionDetector(this.mapData);

            // Remove listeners antigos
            this.mapImg.removeEventListener("load", this.checkAssetsLoaded.bind(this)); 
            this.player.sprite.img.removeEventListener("load", this.checkAssetsLoaded.bind(this));

            // Reset assetsLoaded para o novo carregamento
            this.assetsLoaded = 0; 
            
            // Adiciona novos listeners
            this.mapImg.addEventListener("load", this.checkAssetsLoaded.bind(this));
            this.player.sprite.img.addEventListener("load", this.checkAssetsLoaded.bind(this));
            
            this.mapImg.src = `assets/images/maps/${mapName}.png`;
            this.player.sprite.img.src = this.player.sprite.imgURL;

            this.defineMapTransitionAreas(mapName); 

        } catch (error) {
            console.error("Error loading map:", error);
        }
    }

    defineMapTransitionAreas(mapName) {
        // Mapa 1
        if (mapName === 'map') {

            if (playerTransitionLocation === 'map') {
                console.log("1"); 
                this.player.x = 5*9;
                this.player.y = 18*16;
            }
            //this.ctx.fillRect((5*9) - camX, (17*16) - camY, 32, 32);
            playerTransitionLocation = 'map2'; 

            //Transição do MAPA 1 para o MAPA 2
            this.sceneManager.addTransitionArea(-1, 17, 2, 2, 'map2');
                              
        // Mapa 2 
        } else if (mapName === 'map2') {
            if (playerTransitionLocation === 'map2') {
                console.log("2");
                
                console.log(playerTransitionLocation);
                this.player.x = 45*16.4;
                this.player.y = 127;
            }

            playerTransitionLocation = 'map'; 

            //Transição do MAPA 2 para o MAPA 1
            this.sceneManager.addTransitionArea(47, 6, 1, 4, 'map');
            
        }
    }

    checkAssetsLoaded() {
        this.assetsLoaded++;
        if (this.assetsLoaded === 2) {
            if (!this.gameLoopStarted) { // Adicionado para garantir que o loop só começa uma vez
                this.gameLoop();
                this.gameLoopStarted = true;
            }
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

        // Calcula a nova posição baseada na input do jogador
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

        // Variáveis para guardar as posições finais após verificação de colisão
        let finalX = this.player.x;
        let finalY = this.player.y;

        if (this.collisionDetector) {
            // Verifica colisão na X antes de atualizar newX
            if (!this.collisionDetector.isColliding(newX, this.player.y, this.player.width, this.player.height)) {
                finalX = newX;
            }
            // Verifica colisão na Y antes de atualizar newY
            if (!this.collisionDetector.isColliding(this.player.x, newY, this.player.width, this.player.height)) {
                finalY = newY;
            }
        }
        
        // NOVO: Chama o método update do Player com as posições finais e a tecla ativa
        // O Player agora é responsável por atualizar a sua própria posição, animação e som
        this.player.update(finalX, finalY, activeKey);


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
        this.ctx.fillRect((-1*16) - camX, (17*16) - camY, 32, 32);
        


        // Desenha a segunda área de transição AJUSTADA PARA A CÂMARA
        this.ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        this.ctx.fillRect((47*16) - camX, (6*16) - camY, 16, 64);

        this.sceneManager.renderTransition();
    }
}

export default GameEngine;