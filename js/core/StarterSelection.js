import Pokemon from "../entities/Pokemon.js";

class StarterSelection {
  constructor(canvas, starters, player) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.starters = starters;
    this.player = player;
    this.backgroundImage = new Image();
    this.backgroundImage.src = 'assets/images/background/starter.jpg';
    this.selectedIndex = 0;
    this.isSelecting = true

    // Pré-carregar imagens
    this.images = [];
    this.starters.forEach((starter, index) => {
      if (starter.imgFront) {
        const img = new Image();
        img.src = starter.imgFront;
        this.images[index] = img;
      } else {
        this.images[index] = null;
      }
    });

    this.handleKeyDown = this.handleKeyDown.bind(this);
    window.addEventListener('keydown', this.handleKeyDown);
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
    let pokemon = this.starters[this.selectedIndex]
    console.log(pokemon)

    this.player.pokemons.push(new Pokemon(pokemon.name, pokemon.hp, pokemon.attack, pokemon.imgFront, pokemon.imgBack));
    console.log(this.player.pokemons)
    this.isSelecting = false
  }

  render() {
    const ctx = this.ctx;

    if (this.backgroundImage && this.backgroundImage.complete) {
      ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Título - no topo, centralizado horizontalmente
    ctx.font = "bold 12px Arial";
    ctx.fillText("Escolha seu pokémon inicial!", this.canvas.width / 2, this.canvas.height * 0.15);

    // Espaço entre starters
    const spacing = 85;
    const totalWidth = (this.starters.length - 1) * spacing;
    const centerX = this.canvas.width / 2;
    const baseY = this.canvas.height / 2;

    this.starters.forEach((starter, index) => {
      const x = centerX - totalWidth / 2 + index * spacing;
      const y = baseY;

      // Caixa ao redor do Pokémon
      ctx.fillStyle = (index === this.selectedIndex) ? "#CC0000" : "white";
      ctx.fillRect(x - 45, y - 45, 90, 90);

      // Nome do Pokémon abaixo da caixa
      ctx.fillStyle = "white";
      ctx.font = "bold 12px Arial";
      ctx.fillText(starter.name, x, this.canvas.height * 0.85);

      // Imagem do Pokémon (pré-carregada)
      const img = this.images[index];
      if (img && img.complete) {
        ctx.drawImage(img, x - 32, y - 32, 64, 64);
      }
    });

    // Instruções - na parte inferior, centralizado
    ctx.font = "bold 9px Arial";
    ctx.fillText("Use as para selecionar, ENTER para confirmar", this.canvas.width / 2, this.canvas.height * 0.95);
  }

  isSelectingStarter() {
    return this.isSelecting
  }
}

export default StarterSelection;
