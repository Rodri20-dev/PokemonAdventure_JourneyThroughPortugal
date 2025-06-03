/**
 * Classe responsável pelo gerenciamento de áudio do jogo.
 */
class Sounds {
    constructor() {
        // Configura o objeto de áudio para música de fundo
        this.currentBGM = new Audio();
        this.currentBGM.loop = true; // Música em loop
        this.currentBGM.volume = 0.5; // Volume padrão (50%)
    }

    /**
     * Reproduz um arquivo de som.
     * @param {string} file - Caminho relativo do arquivo de som.
     */
    playSound(file) {
        // Pára e reseta a música atual
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
        
        // Configura nova fonte de áudio
        this.currentBGM.src = `assets/sounds/${file}`;
        this.currentBGM.loop = true;

        // Tenta reproduzir (com tratamento de erro para autoplay bloqueado)
        const playPromise = this.currentBGM.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.warn("Autoplay impedido para a música:", error);
            });
        }
    }

    /**
     * Para a reprodução de áudio atual.
     */
    stopSound() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
    }

    /**
     * Verifica se há áudio sendo reproduzido.
     * @param {HTMLAudioElement} audio - Elemento de áudio a verificar.
     * @returns {boolean} True se estiver tocando, False caso contrário.
     */
    isAudioPlaying(audio) {
        return !audio.paused;
    }
}

export default Sounds;