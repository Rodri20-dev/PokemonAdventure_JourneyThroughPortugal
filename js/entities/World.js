import Entity from "./Entity.js";

/**
 * Classe que representa o mundo do jogo.
 * Estende a classe Entity para gerenciar o mapa e seus dados.
 */
var World = Entity.extend(function () {
    this.constructor = function () {
        this.super(); // Chama construtor da classe pai

        // Configurações do sprite (vazias, serão preenchidas ao carregar mapa)
        this.sprite = {
            img: "",       // Referência à imagem carregada
            imgURL: "",    // Caminho da imagem (vazio inicialmente)
            sourceX: 0,    // Posição X no spritesheet
            sourceY: 0,    // Posição Y no spritesheet
            sourceWidth: 0, // Largura do sprite
            sourceHeight: 0 // Altura do sprite
        };
        
        // Dados do mapa (serão carregados posteriormente)
        this.data = null;
        
        // Posição inicial (0,0)
        this.x = 0;
        this.y = 0;
    };

    // Método de atualização vazio
    this.update = function () {
    };
});

export default World;