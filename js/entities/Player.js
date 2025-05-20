//Player.js
import Entity from "./Entity.js";

var Player = Entity.extend(function () {

    // NOVO: O construtor agora aceita 'gameSounds' como argumento
    this.constructor = function (gameSounds) {
        this.super();

        this.sprite = {
            img: "",
            imgURL: "assets/images/characters/player.png",
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 32,
            sourceHeight: 48
        };
        this.x = 160;
        this.y = 128;
        this.width = 16;
        this.height = 24;
        this.speed = 4;
        this.numberOfFrames = 4;
        this.currentFrame = 0;
        this.states = {
            DOWN: 0,
            LEFT: 1,
            RIGHT: 2,
            UP: 3
        };
        this.state = 0;
        this.animationCounter = 0;
        this.animationSpeed = 8;

        // NOVO: Guarda a instância de Sounds
        this.gameSounds = gameSounds;
        // NOVO: Variável para guardar a última posição para detetar movimento
        this.lastPosition = { x: this.x, y: this.y }; 
    };

    // NOVO: Adiciona um método 'update' que será chamado pelo GameEngine
    // Ele receberá as coordenadas JÁ AJUSTADAS PELA COLISÃO do GameEngine
    this.update = function (newX, newY, activeKey) {
        const oldX = this.x;
        const oldY = this.y;

        // Atualiza a posição do jogador
        this.x = newX;
        this.y = newY;

        // Verifica se houve movimento (ou seja, se o jogador não colidiu ou parou)
        const hasMoved = (this.x !== oldX || this.y !== oldY);

        if (hasMoved) {
            // Toca o som do passo se o jogador se moveu
            this.gameSounds.playFootstep();
            // Atualiza a animação se o jogador está a mover-se
            this.updateAnimation();
        } else {
            // Se o jogador não se moveu (parou ou colidiu)
            // Para o som do passo
            this.gameSounds.stopFootstep();
            // Reseta a animação para o frame parado
            this.resetAnimation();
        }

        // Atualiza a última posição para a próxima verificação (agora é a posição atual)
        this.lastPosition = { x: this.x, y: this.y };
    };

    this.updateAnimation = function () {
        this.animationCounter++;
        if (this.animationCounter >= this.animationSpeed) {
            this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
            this.animationCounter = 0;
        }
        this.sprite.sourceX = this.currentFrame * this.sprite.sourceWidth;
        this.sprite.sourceY = this.state * this.sprite.sourceHeight;

    };
    this.resetAnimation = function () {
        this.currentFrame = 0;
        this.animationCounter = 0;
        this.sprite.sourceX = 0; // Define para o primeiro frame (parado)
    };

});

export default Player;