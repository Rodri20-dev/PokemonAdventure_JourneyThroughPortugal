//Sounds.js

class Sounds {
    constructor() {
        // Mantém a lógica existente para a música de fundo
        this.currentBGM = new Audio();
        this.currentBGM.loop = true;
        this.currentBGM.volume = 0.5; 

        // NOVO: Audio dedicado para o som do passo
        this.footstepSound = new Audio('../../assets/sounds/effects/footstep.mp3'); 
        this.footstepSound.volume = 0.5; // Ajusta o volume conforme necessário
        this.footstepSound.playbackRate = 3; // Opcional: para um som mais "rápido"
    }

    playSound(file) {
        // Lógica existente para tocar a música de fundo
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
        // Nota: Assumindo que "intro_theme.mp3" e "map_theme.mp3" estão na pasta 'assets/sounds/'
        this.currentBGM.src = `assets/sounds/${file}`;
        
        const playPromise = this.currentBGM.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
            }).catch(error => {
                console.warn("Autoplay impedido para a música do mapa:", error);
            });
        }
    }

    stopSound() {
        // Lógica existente para parar a música de fundo
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
            // this.currentBGM = null; // Evita null para poder redefinir o src
        }
    }

    // NOVO: Método para tocar o som do passo
    playFootstep() {
        // Toca o som APENAS se ele não estiver a tocar
        if (this.footstepSound.paused || this.footstepSound.ended) {
            this.footstepSound.currentTime = 0; // Reinicia o som
            this.footstepSound.play().catch(error => {
                console.warn("Autoplay impedido para o som do passo:", error);
            });
        }
    }

    // NOVO: Método para parar o som do passo
    stopFootstep() {
        if (!this.footstepSound.paused) {
            this.footstepSound.pause();
            this.footstepSound.currentTime = 0; // Reinicia para começar do zero na próxima vez
        }
    }
}

export default Sounds;