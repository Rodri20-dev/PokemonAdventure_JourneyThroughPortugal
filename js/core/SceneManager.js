// js/core/SceneManager.js
class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.canvas = gameEngine.canvas;
        this.ctx = gameEngine.ctx;
        this.isTransitioning = false;
        this.transitionAlpha = 1;
        this.transitionSpeed = 0.05;
        this.targetMap = null;
        this.transitionCallback = null;
        this.triggerAreas = [];
    }

    addTransitionArea(x, y, width, height, targetMap) {
        this.triggerAreas.push({ x, y, width, height, targetMap });
    }

    clearTransitionAreas() { // ADICIONA ESTE MÉTODO
        this.triggerAreas = [];
    }

    checkTransitionAreas(playerX, playerY) {
        if (this.isTransitioning) return;

        for (const area of this.triggerAreas) {
            if (
                playerX >= area.x &&
                playerX < area.x + area.width &&
                playerY >= area.y &&
                playerY < area.y + area.height
            ) {
                this.startTransition(area.targetMap);
                break;
            }
        }
    }

    startTransition(targetMap) {
        this.isTransitioning = true;
        this.transitionAlpha = 0;
        this.targetMap = targetMap;

        const callback = () => {
            console.log("Transition complete. Calling loadMap with:", this.targetMap);
            this.gameEngine.loadMap(this.targetMap);
            this.isTransitioning = false;
            this.transitionAlpha = 1;
            this.transitionCallback = null; // Limpa o callback após a execução
        };
        this.transitionCallback = callback;
    }

    updateTransition() {
        if (!this.isTransitioning) return;

        this.transitionAlpha += this.transitionSpeed;
        if (this.transitionAlpha >= 1) {
            if (this.transitionCallback) {
                this.transitionCallback();
            }
        }
    }

    renderTransition() {
        if (!this.isTransitioning) return;

        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default SceneManager;