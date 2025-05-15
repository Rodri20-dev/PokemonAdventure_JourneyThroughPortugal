//InputHandler.js
class InputHandler {
    constructor(player) {
        this.activeKey = null;
        this.player = player
    }

    handleKeyDown(e) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            this.activeKey = e.code;
        }
    }

    handleKeyUp(e) {
        if (e.code === this.activeKey) {
            this.activeKey = null;
            this.player.resetAnimation()
        }
    }

    getActiveKey() {
        return this.activeKey;
    }
}

export default InputHandler