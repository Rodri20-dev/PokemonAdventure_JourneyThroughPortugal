/**
 * Classe responsável por gerenciar diálogos e interações com NPCs.
 */
class DialogueManager {
    constructor(canvas, ctx) {
        // Referências para o canvas e contexto de renderização
        this.canvas = canvas;
        this.ctx = ctx;

        // Estado do diálogo
        this.dialogueActive = false; // Indica se um diálogo está ativo
        this.options = ["Sim", "Não"]; // Opções de resposta padrão
        this.selectedOption = 0; // Opção atualmente selecionada
        this.messages = []; // Mensagens do diálogo atual
        this.currentMessageIndex = 0; // Índice da mensagem atual
        this.onAccept = null; // Callback para opção "Sim"
        this.onDecline = null; // Callback para opção "Não"



        //parte do controlo
        this.prevXButtonPressed = false;
        this.gamepadIndex = 0; // Ou null se quiser detectar dinamicamente



        // Configura listener de input
        window.addEventListener("keydown", this.handleInput.bind(this));
    }

    /**
     * Inicia um novo diálogo.
     * @param {Array} messages - Lista de mensagens do diálogo.
     * @param {Function} onAccept - Callback para opção "Sim".
     * @param {Function} onDecline - Callback para opção "Não".
     */
    startDialogue(messages, onAccept, onDecline) {
        this.messages = messages;
        this.currentMessageIndex = 0;
        this.dialogueActive = true;
        this.onAccept = onAccept;
        this.onDecline = onDecline;
    }

    /**
     * Manipula entrada do teclado durante diálogos.
     * @param {KeyboardEvent} e - Evento de tecla pressionada.
     */
    handleInput(e) {
        if (!this.dialogueActive) return;

        // Navegação entre opções
        if (e.code === "ArrowRight") {
            this.selectedOption = (this.selectedOption + 1) % this.options.length;
        } else if (e.code === "ArrowLeft") {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length;
        } 
        // Confirmação com Espaço
        else if (e.code === "Space") {
            if (this.currentMessageIndex < this.messages.length - 1) {
                // Avança para próxima mensagem
                this.currentMessageIndex++;
            } else {
                // Fim do diálogo - executa callback apropriado
                if (this.options[this.selectedOption] === "Sim") {
                    this.dialogueActive = false;
                    if (this.onAccept) this.onAccept();
                } else {
                    this.dialogueActive = false;
                    if (this.onDecline) this.onDecline();
                }
            }
        }
    }



    //converter inout do controlo
    handleGamepadInput() {
        const gamepads = navigator.getGamepads();
        const gp = gamepads[this.gamepadIndex];
        if (!gp) return;
    
        // Botão X (índice 0) = "Space"
        const xButton = gp.buttons[0];
        if (xButton.pressed && !this.prevXButtonPressed) {
            this.handleInput({ code: "Space" });
            console.log("X2");
        }
        this.prevXButtonPressed = xButton.pressed;
    
        // Botões de direção
        const leftButton = gp.buttons[14]; // D-Pad Left
        const rightButton = gp.buttons[15]; // D-Pad Right
    
        // Previne múltiplos eventos no mesmo pressionamento
        if (rightButton.pressed && !this.prevRightPressed) {
            this.handleInput({ code: "ArrowRight" });
        }
        if (leftButton.pressed && !this.prevLeftPressed) {
            this.handleInput({ code: "ArrowLeft" });
        }
    
        this.prevRightPressed = rightButton.pressed;
        this.prevLeftPressed = leftButton.pressed;
    }
    

    /**
     * Renderiza o diálogo na tela.
     */
    draw() {
        if (!this.dialogueActive) return;

        // Configurações da caixa de diálogo
        const height = this.canvas.height * 0.2;
        const y = this.canvas.height * 0.7;

        // Desenha caixa de diálogo (fundo branco com borda preta)
        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, y, this.canvas.width, height);
        this.ctx.strokeStyle = "black";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, y, this.canvas.width, height);

        // Desenha mensagem atual
        this.ctx.fillStyle = "black";
        this.ctx.font = "10px Arial";
        this.ctx.fillText(
            this.messages[this.currentMessageIndex], 
            this.canvas.width * 0.3, 
            this.canvas.height * 0.75
        );

        // Desenha opções (se for a última mensagem)
        if (this.currentMessageIndex === this.messages.length - 1) {
            const optionsY = this.canvas.height * 0.85;
            for (let i = 0; i < this.options.length; i++) {
                const x = this.canvas.width * 0.2 + i * this.canvas.width * 0.6;
                // Opção selecionada em vermelho, outras em preto
                this.ctx.fillStyle = (i === this.selectedOption) ? "red" : "black";
                this.ctx.fillText(this.options[i], x, optionsY);
            }
        }
    }

    /**
     * Verifica se há um diálogo ativo.
     * @returns {boolean} True se diálogo ativo, False caso contrário.
     */
    isDialogueActive() {
        return this.dialogueActive;
    }
}

export default DialogueManager;