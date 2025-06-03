/**
 * CLASSE PRINCIPAL DO MOTOR DO JOGO
 * Responsável por coordenar todos os subsistemas do jogo
 * 
 * @class GameEngine
 * @param {HTMLCanvasElement} canvas - Elemento canvas onde o jogo será renderizado
 * @param {Object} gameData - Dados do jogo carregados (mapas, pokémons, etc)
 * @param {Sounds} gameSounds - Sistema de gerenciamento de áudio
 */

import CollisionDetector from "./CollisionDetector.js";
import MovementHandler from "./MovementHandler.js";
import Player from "../entities/Player.js";
import SceneManager from "./SceneManager.js";
import World from "../entities/World.js";
import Battle from "./BattleSystem.js"
import StarterSelection from "./StarterSelection.js";
import NPC from "../entities/NPC.js";
import DialogueManager from "./DialogueManager.js";
class GameEngine {
    /**
     * CONSTRUTOR - Inicializa todos os sistemas do jogo
     * 
     * @param {HTMLCanvasElement} canvas - Elemento <canvas> do DOM
     * @param {Object} gameData - Dados do jogo (mapas, pokémons, configs)
     * @param {Sounds} gameSounds - Instância do gerenciador de áudio
     */
    constructor(canvas, gameData, gameSounds) {
        // Sistema de Renderização
        this.canvas = canvas; // Referência ao elemento canvas HTML
        this.ctx = this.canvas.getContext("2d"); // Contexto 2D para desenho

        // Dados do Jogo
        this.gameData = gameData; // Armazena todos os dados (mapas, pokémons, etc)

        // Sistema de Mundo/Mapa
        this.world = new World(); // Instância do mundo do jogo
        this.world.sprite.img = new Image(); // Imagem do mapa

        // Sistema do Jogador
        this.player = new Player(); // Instância do jogador
        this.player.sprite.img = new Image(); // Sprite do jogador

        // Sistema de Movimento
        this.movementHandler = new MovementHandler(this.player); // Controla movimentação

        // Gerenciamento de Assets
        this.assetsLoaded = 0; // Contador de assets carregados

        // Sistema de Cenas/Transições
        this.sceneManager = new SceneManager(this); // Gerencia troca de mapas

        // Sistema de Áudio
        this.gameSounds = gameSounds; // Gerenciador de sons/músicas

        // Sistema de Diálogos
        this.dialogueManager = new DialogueManager(this.canvas, this.ctx);
        this.dialogue = false; // Flag para diálogo ativo

        // Bind de métodos para manter o contexto
        this.gameLoop = this.gameLoop.bind(this);
        this.checkAssetsLoaded = this.checkAssetsLoaded.bind(this);
        this.keydownHandler = this.movementHandler.handleKeyDown.bind(this.movementHandler);
        this.keyupHandler = this.movementHandler.handleKeyUp.bind(this.movementHandler);
        this.interactionHandler = this.handleInteraction.bind(this);
    }

    /**
     * INICIALIZA O JOGO
     * Configura seleção inicial, carrega assets e inicia loop
     */
    start() {
        // Tela de Seleção Inicial
        this.starterSelection = new StarterSelection(
            this.canvas, // Onde renderizar
            [ // Pokémons iniciais disponíveis
                this.gameData.pokemon[0],
                this.gameData.pokemon[1],
                this.gameData.pokemon[2]
            ],
            this.player // Referência ao jogador
        );

        // Carregamento do Sprite do Jogador
        this.player.sprite.img.addEventListener("load", () => {
            this.loadMap('map'); // Carrega o primeiro mapa após carregar sprite
        });
        this.player.sprite.img.src = this.player.sprite.imgURL; // Inicia carregamento

        // Configuração de Eventos
        window.addEventListener("keydown", this.keydownHandler); // Movimento
        window.addEventListener("keyup", this.keyupHandler); // Parada movimento
        window.addEventListener("keydown", this.interactionHandler); // Interações
    }

    /**
     * MANIPULA INTERAÇÕES DO JOGADOR (Tecla Espaço)
     * 
     * @param {KeyboardEvent} e - Evento de tecla pressionada
     */
    handleInteraction(e) {
        // Verifica se pode interagir (não em batalha ou batalha terminada)
        if (this.battle && !this.battle.isInBattle() || !this.battle) {
            if (e.code === "Space" && this.npc) {
                // Calcula distância do jogador para o NPC
                const dx = Math.abs(this.player.x - this.npc.x);
                const dy = Math.abs(this.player.y - this.npc.y);
                
                // Verifica proximidade (48px = 3 tiles)
                if (dx < 48 && dy < 48) {
                    if (this.player.pokemons.length >= 3) {
                        // Diálogo para batalha com NPC
                        this.dialogueManager.startDialogue(
                            ["Blue: Olá, treinador!", "Blue: Preparado para batalhar?!"],
                            () => { // Callback para opção "Sim"
                                this.startBattle(true); // Inicia batalha contra NPC
                                window.addEventListener("keydown", this.interactionHandler);
                            },
                            () => { // Callback para opção "Não"
                                window.addEventListener("keydown", this.interactionHandler);
                            },
                            true // Mostra opções Sim/Não
                        );
                        window.removeEventListener("keydown", this.interactionHandler);
                    } else {
                        // Diálogo se não tiver pokémons suficientes
                        this.dialogueManager.startDialogue(
                            ["Blue: Você está despreparado!", "Capture pelo menos 3 Pokémons"],
                            () => { window.addEventListener("keydown", this.interactionHandler); },
                            () => { window.addEventListener("keydown", this.interactionHandler); },
                            false // Sem opções
                        );
                        window.removeEventListener("keydown", this.interactionHandler);
                    }
                }
            }
        }
    }

    /**
     * CARREGA UM MAPA ESPECÍFICO
     * 
     * @param {string} mapName - Nome do mapa a ser carregado ('map', 'map2')
     */
    loadMap(mapName) {
        let world = this.world;
        this.sceneManager.clearTransitionAreas(); // Limpa áreas de transição antigas

        // Busca dados do mapa
        const data = this.gameData.maps[mapName];
        if (!data) {
            console.error(`Map data for "${mapName}" not found in gameData.maps`);
            return;
        }

        world.data = data; // Atualiza dados do mundo
        this.collisionDetector = new CollisionDetector(world.data); // Cria detector de colisões

        // Configura carregamento da imagem do mapa
        world.sprite.img.removeEventListener("load", this.checkAssetsLoaded);
        if (this.npc && this.npc.sprite && this.npc.sprite.img) {
            this.npc.sprite.img.removeEventListener("load", this.checkAssetsLoaded);
        }
        world.sprite.img.addEventListener("load", this.checkAssetsLoaded);

        // Inicia carregamento da imagem
        world.sprite.img.src = `assets/images/maps/${mapName}.png`;

        // Adiciona NPC apenas no map2
        if (mapName === 'map2') {
            this.npc = new NPC(8 * 16, 5 * 16); // Cria NPC em posição específica (em pixels)
            this.npc.sprite.img = new Image();
            this.npc.sprite.img.addEventListener("load", this.checkAssetsLoaded(true));
            this.npc.sprite.img.src = this.npc.sprite.imgURL;
        } else {
            this.npc = null; // Remove NPC se não for map2
        }

        this.defineMapTransitionAreas(mapName); // Configura áreas de transição
    }

    /**
     * DEFINE ÁREAS DE TRANSIÇÃO ENTRE MAPAS
     * 
     * @param {string} mapName - Nome do mapa atual
     */
    defineMapTransitionAreas(mapName) {
        if (mapName === 'map') {
            // Posicionamento ao voltar do map2
            if (this.playerTransitionLocation === 'map') {
                this.player.x = 3 * 16; // 3 tiles (48px)
                this.player.y = 17 * 16; // 17 tiles (272px)
            }

            this.playerTransitionLocation = 'map2'; // Próximo destino

            // Área de transição (esquerda do mapa)
            this.sceneManager.addTransitionArea(
                0, // X em tiles
                17, // Y em tiles
                1, // Largura em tiles
                2, // Altura em tiles
                'map2' // Mapa de destino
            );

        } else if (mapName === 'map2') {
            // Posicionamento ao voltar do map1
            if (this.playerTransitionLocation === 'map2') {
                this.player.x = 45 * 16; // 45 tiles (720px)
                this.player.y = 100; // Posição Y em pixels
            }

            this.playerTransitionLocation = 'map'; // Próximo destino

            // Área de transição (direita do mapa)
            this.sceneManager.addTransitionArea(
                47, // X em tiles
                6, // Y em tiles
                1, // Largura em tiles
                4, // Altura em tiles
                'map' // Mapa de destino
            );
        }
    }

    /**
     * VERIFICA SE TODOS ASSETS FORAM CARREGADOS
     * 
     * @param {boolean} isNpc - Indica se o asset carregado é um NPC
     */
    checkAssetsLoaded(isNpc) {
        let total;
        this.assetsLoaded++;
        isNpc ? total = 1 : total = 2; // NPC conta como 1, mapa como 2
        if (this.assetsLoaded == total) {
            this.gameLoop(); // Inicia o loop quando tudo carregar
        }
    }

    /**
     * LOOP PRINCIPAL DO JOGO
     * Executado a cada frame (≈60fps)
     */
    gameLoop() {
        // Renderiza seleção inicial se ativa
        if (this.starterSelection && this.starterSelection.isSelectingStarter()) {
            this.starterSelection.render();
        } 
        // Renderiza diálogo se ativo
        else if (this.dialogueManager.isDialogueActive()) {
            this.dialogueManager.draw();
        } 
        // Jogo normal (fora de batalha)
        else if (!this.battle || !this.battle.isInBattle()) {
            this.update(); // Atualiza lógica
            this.render(); // Renderiza cena
        }

        requestAnimationFrame(this.gameLoop); // Agenda próximo frame
    }

    /**
     * ATUALIZA A LÓGICA DO JOGO
     */
    update() {
        // Movimentação do Jogador
        const activeKey = this.movementHandler.getActiveKey();
        let newX = this.player.x;
        let newY = this.player.y;

        // Calcula nova posição baseada na tecla pressionada
        if (activeKey === "ArrowUp") {
            newY -= this.player.speed; // Move para cima
            this.player.state = this.player.states.UP;
        } else if (activeKey === "ArrowDown") {
            newY += this.player.speed; // Move para baixo
            this.player.state = this.player.states.DOWN;
        } else if (activeKey === "ArrowLeft") {
            newX -= this.player.speed; // Move para esquerda
            this.player.state = this.player.states.LEFT;
        } else if (activeKey === "ArrowRight") {
            newX += this.player.speed; // Move para direita
            this.player.state = this.player.states.RIGHT;
        }

        // Atualiza animação se estiver se movendo
        if (activeKey) this.player.update();

        // Verifica colisões com o novo X
        if (this.collisionDetector) {
            if (!this.collisionDetector.isColliding(newX, this.player.y, this.player.height)) {
                this.player.x = newX; // Atualiza X se não colidir
            }
            // Verifica colisões com o novo Y
            if (!this.collisionDetector.isColliding(this.player.x, newY, this.player.height)) {
                this.player.y = newY; // Atualiza Y se não colidir
            }
        }

        // Verifica áreas de transição
        this.sceneManager.checkTransitionAreas(this.player.x, this.player.y);
        this.sceneManager.updateTransition(); // Atualiza transição em andamento

        // Verifica tiles de grama para batalhas aleatórias
        if (this.world.data && this.world.data.layers && this.world.data.layers[0]) {
            const tileX = Math.floor(this.player.x / this.world.data.tilewidth);
            const tileY = Math.floor(this.player.y / this.world.data.tileheight);
            const tileIndex = tileY * this.world.data.width + tileX;
            const tileId = this.world.data.layers[0].data[tileIndex];

            // Procura por tiles de grama nos tilesets
            const tilesets = this.world.data.tilesets;
            let isGrass = false;

            for (let tileset of tilesets) {
                const firstGid = tileset.firstgid; // Primeiro ID do tileset
                const tileCount = tileset.tilecount || 
                    (tileset.imagewidth / tileset.tilewidth) * 
                    (tileset.imageheight / tileset.tileheight);

                // Verifica se o tile está neste tileset
                if (tileId >= firstGid && tileId < firstGid + tileCount) {
                    const localId = tileId - firstGid;
                    const tile = tileset.tiles?.find(t => t.id === localId);
                    
                    // Verifica propriedade "isGrass"
                    if (tile && tile.properties) {
                        const grassProp = tile.properties.find(p => p.name === "isGrass" && p.value === true);
                        if (grassProp) {
                            isGrass = true;
                            break;
                        }
                    }
                }
            }

            // Lógica de batalha aleatória
            if (isGrass) {
                this.isOnGrass = true;
                this.grassTilePos = { x: tileX, y: tileY };

                // 1% de chance de batalha a cada frame na grama
                if (Math.random() < 0.01) {
                    this.startBattle();
                }
            } else {
                this.isOnGrass = false;
                this.grassTilePos = null;
            }
        }
    }

    /**
     * RENDERIZA A CENA DO JOGO
     */
    render() {
        let world = this.world;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpa frame anterior

        // Cálculo da câmera (centralizada no jogador)
        const camX = this.player.x - this.canvas.width / 2;
        const camY = this.player.y - this.canvas.height / 2;

        // Renderiza o mapa (se carregado)
        if (world.sprite.img && world.data) {
            this.ctx.drawImage(
                world.sprite.img,
                -camX, -camY, // Posição (ajustada pela câmera)
                world.data.width * world.data.tilewidth, // Largura total
                world.data.height * world.data.tileheight // Altura total
            );
        }

        // Destaque visual na grama
        if (this.isOnGrass && this.grassTilePos) {
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.3)"; // Verde semi-transparente
            this.ctx.fillRect(
                (this.grassTilePos.x * this.world.data.tilewidth) - camX,
                (this.grassTilePos.y * this.world.data.tileheight) - camY,
                this.world.data.tilewidth,
                this.world.data.tileheight
            );
        }

        // Renderiza o jogador (centralizado)
        const dx = (this.canvas.width - this.player.width) / 2;
        const dy = (this.canvas.height - this.player.height) / 2;
        this.ctx.drawImage(
            this.player.sprite.img,
            this.player.sprite.sourceX, this.player.sprite.sourceY, // Sprite sheet source
            this.player.sprite.sourceWidth, this.player.sprite.sourceHeight,
            dx, dy, // Posição na tela
            this.player.width, this.player.height // Tamanho na tela
        );

        // Renderiza efeito de transição (se ativo)
        this.sceneManager.renderTransition();

        // Renderiza NPC (se existir)
        if (this.npc) {
            this.ctx.drawImage(
                this.npc.sprite.img, 
                this.npc.x - camX, // Posição X ajustada pela câmera
                this.npc.y - camY, // Posição Y ajustada pela câmera
                this.npc.width, 
                this.npc.height
            );

            // Mostra dica de interação se perto do NPC
            if (Math.abs(this.player.x - this.npc.x) < 48 && Math.abs(this.player.y - this.npc.y) < 48) {
                this.ctx.fillStyle = "white";
                this.ctx.font = "12px Arial";
                this.ctx.fillText(
                    "Pressione espaço para conversar com o NPC", 
                    this.npc.x - camX, 
                    this.player.y + camY
                );
            }
        }
    }

    /**
     * INICIA UMA BATALHA
     * 
     * @param {boolean} isNpcBattle - Indica se é batalha contra NPC
     */
    startBattle(isNpcBattle) {
        // Cria nova instância de batalha
        this.battle = new Battle(
            this.canvas, // Onde renderizar
            this.gameData.pokemon, // Dados dos pokémons
            this.player, // Referência ao jogador
            this.gameSounds, // Sistema de áudio
            isNpcBattle ? this.npc : null // NPC (se for batalha contra NPC)
        );
        
        this.battle.initBattle(isNpcBattle); // Inicializa batalha
        this.gameSounds.playSound("battle_theme.mp3"); // Toca música de batalha
    }
}

export default GameEngine;