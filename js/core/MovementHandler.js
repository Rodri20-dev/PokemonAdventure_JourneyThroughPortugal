//MovementHandler.js
import Sounds from './Sounds.js';

class MovementHandler {
    constructor(player) {
        this.activeKey = null;
        this.sound = new Sounds()
        this.player = player
    }

    handleKeyDown(e) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            this.activeKey = e.code;
            !this.sound.isAudioPlaying(this.sound.currentBGM) ? this.sound.playSound("effects/footstep.mp3") : null            
        }
    }

    handleKeyUp(e) {
        if (e.code === this.activeKey) {
            this.activeKey = null;
            this.player.resetAnimation()
            this.sound.stopSound()
        }
    }

    getActiveKey() {
        return this.activeKey;
    }
}

export default MovementHandler