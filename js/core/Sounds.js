//Sounds.js

class Sounds {
    constructor() {
        this.currentBGM = new Audio();
        this.currentBGM.loop = true;
        this.currentBGM.volume = 0.5;
    }

    playSound(file) {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
        this.currentBGM.src = `assets/sounds/${file}`;

        const playPromise = this.currentBGM.play();
        this.currentBGM.loop = true

        if (playPromise !== undefined) {
            playPromise.then(_ => {
            }).catch(error => {
                console.warn("Autoplay impedido para a música:", error);
            });
        }
    }

    stopSound() {
        if (this.currentBGM) {
            this.currentBGM.pause();
            this.currentBGM.currentTime = 0;
        }
    }

    isAudioPlaying(audio) {
    return !audio.paused;
}

}

export default Sounds;