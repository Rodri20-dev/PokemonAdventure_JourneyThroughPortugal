// js/core/SceneManager.js
class SceneManager {
    constructor(gameEngine) {
        this.gameEngine = gameEngine;
        this.canvas = gameEngine.canvas;
        this.ctx = gameEngine.ctx;
        this.isTransitioning = false;
        this.transitionAlpha = 1;
        this.transitionSpeed = 0.05;
        this.transitionPhase = null; // "out" ou "in"
        this.targetMap = null;
        this.transitionCallback = null;
        this.triggerAreas = [];
    }

    addTransitionArea(x, y, width, height, targetMap) {
        this.triggerAreas.push({ x: x * 16, y: y * 16, width: width * 16, height: height * 16, targetMap });
    }

    clearTransitionAreas() { 
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
        this.transitionPhase = "out";
        this.targetMap = targetMap;

        this.transitionCallback = () => {
            this.gameEngine.loadMap(this.targetMap);
            this.transitionPhase = "in";
        };
    }

    updateTransition() {
        if (!this.isTransitioning) return;

        if (this.transitionPhase === "out") {
            this.transitionAlpha += this.transitionSpeed;
            if (this.transitionAlpha >= 1) {
                this.transitionAlpha = 1;
                if (this.transitionCallback) {
                    this.transitionCallback();
                    this.transitionCallback = null;
                }
            }
        } else if (this.transitionPhase === "in") {
            this.transitionAlpha -= this.transitionSpeed;
            if (this.transitionAlpha <= 0) {
                this.transitionAlpha = 0;
                this.isTransitioning = false;
                this.transitionPhase = null;
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