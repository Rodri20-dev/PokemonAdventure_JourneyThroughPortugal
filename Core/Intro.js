// Intro.js
export default class Intro {
    constructor(canvas, ctx, onIntroComplete) { // Adiciona um callback onIntroComplete
        this.canvas = canvas;
        this.ctx = ctx;
        this.isActive = true;
        this.img = new Image();
        this.blinkTimer = 0;
        this.showPressEnter = true;
        this.loaded = false;
        this.onIntroComplete = onIntroComplete; // Guarda o callback

        // Animação
        this.COLUMNS = 3;
        this.WIDTH = 240;
        this.HEIGHT = 160;
        this.numberOfFrames = 5;
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 20;
        this.animationFinished = false;

        this.img.onload = () => {
            this.loaded = true;
        };
        this.img.src = '/assets/intro/intro.png';
    }

    update() {
        if (!this.isActive) return;

        if (!this.animationFinished) {
            this.frameTimer++;
            if (this.frameTimer >= this.frameInterval) {
                this.frameTimer = 0;
                this.currentFrame++;
                if (this.currentFrame >= this.numberOfFrames) {
                    this.currentFrame = this.numberOfFrames - 1;
                    this.animationFinished = true;
                }
            }
        }

        // ✨ Texto piscante
        this.blinkTimer++;
        if (this.blinkTimer >= 30) {
            this.blinkTimer = 0;
            this.showPressEnter = !this.showPressEnter;
        }
    }

    render() {
        if (!this.isActive || !this.loaded) return;

        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        const sourceX = (this.currentFrame % this.COLUMNS) * this.WIDTH;
        const sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.HEIGHT;

        const destX = (this.canvas.width - this.WIDTH) / 2;
        const destY = (this.canvas.height - this.HEIGHT) / 2 - 20;

        this.ctx.drawImage(
            this.img,
            sourceX, sourceY, this.WIDTH, this.HEIGHT,
            destX, destY, this.WIDTH, this.HEIGHT
        );

        if (this.showPressEnter) {
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = "8px 'Press Start 2P'";
            this.ctx.textAlign = "center";
            this.ctx.fillText("PRESS ENTER", this.canvas.width / 2, this.canvas.height - 20);
        }
    }

    handleKeyDown(e) {
        if (e.code === "Enter" && this.isActive) {
            this.isActive = false;
            if (this.onIntroComplete) {
                this.onIntroComplete(); // Chama o callback para iniciar o jogo
            }
        }
    }
}