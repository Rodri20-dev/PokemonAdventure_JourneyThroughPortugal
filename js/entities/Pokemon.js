import Entity from "./Entity.js";

/**
 * Classe que representa um Pokémon.
 * Estende a classe Entity com propriedades específicas de Pokémon.
 */
var Pokemon = Entity.extend(function () {
    this.constructor = function (pName, hp, attack, imgFront, imgBack) {
        this.super(); // Chama construtor da classe pai

        // Configurações do sprite
        this.sprite = {
            img: "",       // Referência à imagem carregada
            imgFront: imgFront, // Imagem para batalha (frente)
            imgBack: imgBack,   // Imagem para batalha (costas)
            sourceX: 0,      // Posição X no spritesheet
            sourceY: 0,      // Posição Y no spritesheet
            sourceWidth: 96,  // Largura do sprite
            sourceHeight: 96  // Altura do sprite
        };
        
        // Propriedades do Pokémon
        this.name = pName;   // Nome do Pokémon
        this.maxHp = hp;     // HP máximo
        this.hp = hp;        // HP atual
        this.attack = attack; // Poder de ataque
    };

    /**
     * Verifica se o Pokémon está vivo
     * @returns {boolean} True se HP > 0, False caso contrário
     */
    this.isAlive = function () {
        return this.hp > 0;
    };

    // Método de atualização vazio (pode ser extendido)
    this.update = function () {
    };
});

export default Pokemon;