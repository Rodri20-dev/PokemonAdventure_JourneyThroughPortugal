class StarterSelection {
  constructor(canvas, ctx, starters) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.starters = starters;

    this.selectedIndex = 0;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
  }

  show() {
  }

  handleKeyDown(e) {
    if (e.key === 'ArrowLeft') {
      this.selectedIndex = (this.selectedIndex - 1 + this.starters.length) % this.starters.length;
    } else if (e.key === 'ArrowRight') {
      this.selectedIndex = (this.selectedIndex + 1) % this.starters.length;
    } else if (e.key === 'Enter') {
      this.chooseStarter();
    }
  }

  chooseStarter() {
    window.removeEventListener('keydown', this.handleKeyDown);
    this.onChoose(this.starters[this.selectedIndex]);
  }

  onChoose() {}

  render() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.fillStyle = "black";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Choose your starter Pokémon!", this.canvas.width / 2, 50);

    const startX = this.canvas.width / 2 - (this.starters.length * 100) / 2;

    this.starters.forEach((starter, index) => {
      const x = startX + index * 100;
      const y = this.canvas.height / 2;

      // Desenha uma caixa para o pokemon
      ctx.fillStyle = (index === this.selectedIndex) ? "yellow" : "white";
      ctx.fillRect(x - 40, y - 40, 80, 80);

      // Desenha o nome do pokémon
      ctx.fillStyle = "black";
      ctx.font = "16px Arial";
      ctx.fillText(starter.name, x, y + 50);

      // Se tiver imagem (sprite) desenhe aqui
      if (starter.sprite) {
        const img = new Image();
        img.src = starter.sprite;
        // Como o carregamento é async, desenha quando carregar
        img.onload = () => {
          ctx.drawImage(img, x - 32, y - 32, 64, 64);
        }
      }
    });

    ctx.font = "16px Arial";
    ctx.fillText("Use ← → to select, ENTER to confirm", this.canvas.width / 2, this.canvas.height - 30);
  }
}

export default StarterSelection;
