// C:\Users\Lenovo\Desktop\Licenciatura\2ºAno\2ºSemestre\Aplicações multimedia\PokemonAdventure_JourneyThroughPortugal\js\core\Sounds.js

class Sounds {
    constructor() {
        this.currentBGM = null;
        this.mapTheme = new Audio('../../assets/sounds/map_theme.mp3'); // VERIFICA ESTE CAMINHO!

        this.mapTheme.loop = true;
        this.mapTheme.volume = 0.5; 
    }

    playMapBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
        this.currentBGM = this.mapTheme;
        
        const playPromise = this.currentBGM.play();

        if (playPromise !== undefined) {
            playPromise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                console.warn("Autoplay impedido para a música do mapa:", error);
                // Pode ser necessário um clique do utilizador para iniciar o áudio devido a políticas de autoplay
                // Considera adicionar um botão de "Play" ou um aviso visual para o utilizador clicar.
            });
        }
    }

    stopBGM() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
            this.currentBGM = null;
        }
    }
}

export default Sounds;