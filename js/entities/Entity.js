/**
 * Classe base para todas as entidades do jogo.
 * Fornece propriedades e métodos básicos para sprites e posicionamento.
 */
var Entity = Class.extend(function () {
    // Configurações básicas do sprite
    this.sprite = {
        sourceX: 0,      // Posição X no spritesheet
        sourceY: 0,      // Posição Y no spritesheet
        sourceWidth: 48,  // Largura do sprite
        sourceHeight: 64  // Altura do sprite
    };
    
    // Posição no mundo
    this.x = 0;          // Posição X
    this.y = 0;          // Posição Y
    
    // Dimensões na tela
    this.width = 64;     // Largura renderizada
    this.height = 64;    // Altura renderizada

    // Construtor vazio 
    this.constructor = function () { };
    
    // Método de atualização vazio
    this.update = function () {
    };
});

export default Entity;