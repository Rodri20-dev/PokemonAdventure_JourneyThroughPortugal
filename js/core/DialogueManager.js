class DialogueManager {
    constructor(canvas, ctx) {
        this.canvas = canvas
        this.ctx = ctx

        this.dialogueActive = false
        this.options = ["Sim", "Não"]
        this.selectedOption = 0
        this.messages = []
        this.currentMessageIndex = 0
        this.onAccept = null
        this.onDecline = null

        // Input
        window.addEventListener("keydown", this.handleInput.bind(this));

    }

    startDialogue(messages, onAccept, onDecline) {
        this.messages = messages
        this.currentMessageIndex = 0
        this.dialogueActive = true
        this.onAccept = onAccept
        this.onDecline = onDecline
        console.log(messages)
    }



    handleInput(e) {
        if (!this.dialogueActive) return

        if (e.code === "ArrowRight") {
            console.log("dddd")
            this.selectedOption = (this.selectedOption + 1) % this.options.length
        } else if (e.code === "ArrowLeft") {
            this.selectedOption = (this.selectedOption - 1 + this.options.length) % this.options.length
        } else if (e.code === "Space") {
            console.log("dddd")
            if (this.currentMessageIndex < this.messages.length - 1) {
                console.log(this.currentMessageIndex)
                this.currentMessageIndex++

            } else {
                if (this.options[this.selectedOption] === "Sim") {
                    this.dialogueActive = false
                    if (this.onAccept) this.onAccept()
                } else {
                    this.dialogueActive = false
                    if (this.onDecline) this.onDecline()
                }
            }
        }
    }

    draw() {
        if (!this.dialogueActive) return

        // Caixa de diálogo
        const height = this.canvas.height * 0.2
        const y = this.canvas.height * 0.7
        this.ctx.fillStyle = "white"
        this.ctx.fillRect(0, y, this.canvas.width, height)

        this.ctx.strokeStyle = "black"
        this.ctx.lineWidth = 2
        this.ctx.strokeRect(0, y, this.canvas.width, height)

        // Mensagem
        this.ctx.fillStyle = "black"
        this.ctx.font = "10px Arial"
        this.ctx.fillText(this.messages[this.currentMessageIndex], this.canvas.width * 0.3, this.canvas.height * 0.75)

        // Opções
        const optionsY = this.canvas.height * 0.85
        for (let i = 0; i < this.options.length; i++) {
            const x = this.canvas.width * 0.2 + i * this.canvas.width * 0.6
            this.ctx.fillStyle = (i === this.selectedOption) ? "red" : "black"
            this.ctx.fillText(this.options[i], x, optionsY)
        }
    }

    isDialogueActive() {
        return this.dialogueActive
    }
}

export default DialogueManager