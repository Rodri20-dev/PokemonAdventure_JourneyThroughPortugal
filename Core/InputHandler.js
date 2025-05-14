export default class InputHandler {
    constructor(player) {
        this.player = player;
        this.activeKey = null;

        window.addEventListener("keydown", this.handleKeyDown.bind(this));
        window.addEventListener("keyup", this.handleKeyUp.bind(this));
    }

    handleKeyDown(e) {
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            this.activeKey = e.code;
        }
    }

    handleKeyUp(e) {
        if (e.code === this.activeKey) {
            this.activeKey = null;
        }
    }

    getActiveKey() {
        return this.activeKey;
    }
}