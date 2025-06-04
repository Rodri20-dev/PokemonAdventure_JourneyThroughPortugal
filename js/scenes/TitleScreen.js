/**
 * Classe que gerencia a tela de introdução/título do jogo.
 */
class Intro {
    constructor(canvas) {
        // Configurações básicas
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.isActive = true; // Controla se a tela está ativa
        this.img = new Image(); // Imagem da animação
        this.blinkTimer = 0; // Timer para piscar texto "PRESS ENTER"
        this.showPressEnter = true; // Controla visibilidade do texto
        this.loaded = false; // Flag para imagem carregada

        // Configurações de animação
        this.COLUMNS = 3; // Colunas no spritesheet
        this.WIDTH = 240; // Largura de cada frame
        this.HEIGHT = 160; // Altura de cada frame
        this.numberOfFrames = 5; // Total de frames na animação
        this.currentFrame = 0; // Frame atual
        this.frameTimer = 0; // Contador para troca de frames
        this.frameInterval = 20; // Intervalo entre frames
        this.animationFinished = false; // Flag para animação concluída




        //parte do controlo
        this.gamepadIndex = 0;
        this.prevAButtonPressed = false;




        // Configura carregamento da imagem
        this.img.onload = () => {
            this.loaded = true;
        };
        this.img.src = 'assets/images/intro/intro.png';
    }

    /**
     * Atualiza o estado da tela de título
     */
    update() {
        if (!this.isActive) return;

        // Animação dos frames
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

        // Timer para piscar o texto "PRESS ENTER"
        this.blinkTimer++;
        if (this.blinkTimer >= 30) {
            this.blinkTimer = 0;
            this.showPressEnter = !this.showPressEnter;
        }
        
        // Verifica inputs do controlo
        //this.handleGamepadInput();
    }

    /**
     * Renderiza a tela de título
     */
    render() {
        if (!this.isActive || !this.loaded) return;

        // Fundo preto
        this.ctx.fillStyle = "#000000";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Calcula posição do frame atual no spritesheet
        const sourceX = (this.currentFrame % this.COLUMNS) * this.WIDTH;
        const sourceY = Math.floor(this.currentFrame / this.COLUMNS) * this.HEIGHT;

        // Centraliza a animação na tela
        const destX = (this.canvas.width - this.WIDTH) / 2;
        const destY = (this.canvas.height - this.HEIGHT) / 2 - 20;

        // Desenha o frame atual
        this.ctx.drawImage(
            this.img,
            sourceX, sourceY, this.WIDTH, this.HEIGHT,
            destX, destY, this.WIDTH, this.HEIGHT
        );

        // Desenha texto "PRESS ENTER" (piscando)
        if (this.showPressEnter) {
            this.ctx.fillStyle = "#FFFFFF";
            this.ctx.font = "16px 'PokemonFont'";
            this.ctx.textAlign = "center";
            this.ctx.fillText("PRESS ENTER", this.canvas.width / 2, this.canvas.height - 20);
        }
    }

    /**
     * Manipula pressionamento de tecla
     * @param {KeyboardEvent} e - Evento de tecla
     */
    handleKeyDown(e) {
        if (e.code === "Enter") {
            this.isActive = false; // Sai da tela de título
        }
    }


    
    //converter inputs do controlo
    /* handleGamepadInput() {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[this.gamepadIndex];
        if (!gp) return;

        // Botão A (índice 0)
        const aButton = gp.buttons[0];
        if (aButton.pressed && !this.prevAButtonPressed) {
            this.handleKeyDown({ code: "Enter" });this.isActive = false; // Sai da tela de título
        }
        this.prevAButtonPressed = aButton.pressed;
    } */



}

export default Intro;