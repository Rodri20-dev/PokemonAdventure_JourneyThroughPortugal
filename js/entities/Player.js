import Entity from "./Entity.js";

/**
 * Classe que representa o jogador.
 * Estende a classe Entity com configurações específicas para o personagem do jogador.
 */
var Player = Entity.extend(function () {
    this.constructor = function () {
        this.super(); // Chama construtor da classe pai

        // Configurações do sprite
        this.sprite = {
            img: "", // Referência à imagem carregada
            imgURL: "assets/images/characters/player.png", // Caminho da imagem
            sourceX: 0,      // Posição X no spritesheet
            sourceY: 0,      // Posição Y no spritesheet
            sourceWidth: 32,  // Largura do sprite
            sourceHeight: 48   // Altura do sprite
        };
        
        // Posição inicial
        this.x = 11*16 + 8;
        this.y = 8*16;
        
        // Dimensões na tela
        this.width = 16;
        this.height = 24;
        
        // Propriedades de movimento
        this.speed = 4; // Velocidade de movimento
        
        // Configurações de animação
        this.numberOfFrames = 4; // Número de frames de animação
        this.currentFrame = 0;   // Frame atual
        this.states = {          // Estados de movimento
            DOWN: 0,
            LEFT: 1,
            RIGHT: 2,
            UP: 3
        };
        this.state = 0;          // Estado atual
        this.animationCounter = 0; // Contador para animação
        this.animationSpeed = 8;  // Velocidade da animação
        
        // Lista de Pokémon do jogador
        this.pokemons = [];
    };

    /**
     * Atualiza a animação do jogador
     */
    this.update = function () {
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
            this.animationCounter = 0;
        }
        // Atualiza posição no spritesheet
        this.sprite.sourceX = this.currentFrame * this.sprite.sourceWidth;
        this.sprite.sourceY = this.state * this.sprite.sourceHeight;
    };
    
    /**
     * Reseta a animação para o frame inicial
     */
    this.resetAnimation = function () {
        this.currentFrame = 0;
        this.animationCounter = 0;
        this.sprite.sourceX = 0;
    };
});

export default Player;