/**
 * Classe responsável por gerenciar o movimento do jogador.
 */
import Sounds from './Sounds.js';
class MovementHandler {
    /**
     * @param {Player} player - Instância do jogador a ser controlada.
     */
    constructor(player) {
        this.activeKey = null; // Tecla atualmente pressionada
        this.sound = new Sounds(); // Sistema de sons para efeitos de movimento
        this.player = player; // Referência ao jogador
    }

    /**
     * Manipula evento de tecla pressionada.
     * @param {KeyboardEvent} e - Evento de tecla.
     */
    handleKeyDown(e) {
        // Verifica se é uma tecla de movimento
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            this.activeKey = e.code; // Registra tecla ativa
            
            // Toca som de passos se não houver música tocando
            if (!this.sound.isAudioPlaying(this.sound.currentBGM)) {
                this.sound.playSound("effects/footstep.mp3");
            }
        }
    }

    /**
     * Manipula evento de tecla liberada.
     * @param {KeyboardEvent} e - Evento de tecla.
     */
    handleKeyUp(e) {
        // Se a tecla liberada for a tecla ativa
        if (e.code === this.activeKey) {
            this.activeKey = null; // Limpa tecla ativa
            this.player.resetAnimation(); // Reseta animação do jogador
            this.sound.stopSound(); // Para som de passos
        }
    }

    /**
     * Obtém a tecla de movimento ativa.
     * @returns {string|null} Código da tecla ativa ou null.
     */
    getActiveKey() {
        return this.activeKey;
    }
}

export default MovementHandler;