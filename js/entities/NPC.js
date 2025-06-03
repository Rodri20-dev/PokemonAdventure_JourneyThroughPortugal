import Entity from "./Entity.js";

/**
 * Classe que representa um NPC (Personagem Não-Jogador).
 * Estende a classe Entity com configurações específicas para NPCs.
 */
var NPC = Entity.extend(function () {
    this.constructor = function (x, y) {
        this.super(); // Chama construtor da classe pai

        // Configurações do sprite
        this.sprite = {
            img: "", // Referência à imagem carregada
            imgURL: "assets/images/characters/npc.png", // Caminho da imagem
            sourceX: 0,      // Posição X no spritesheet
            sourceY: 0,      // Posição Y no spritesheet
            sourceWidth: 16,  // Largura do sprite
            sourceHeight: 24  // Altura do sprite
        };
        
        // Posição inicial
        this.x = x;
        this.y = y;
        
        // Dimensões na tela
        this.width = 16;
        this.height = 24;
        
        // Lista de Pokémon do NPC
        this.pokemons = [];
    };

    // Método de atualização vazio (pode ser extendido)
    this.update = function () {
    };
});

export default NPC;