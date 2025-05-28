import Pokemon from "../entities/Pokemon.js";

class Battle {
  constructor(canvas, pokemonData) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.bgImage = new Image();
    this.barImage = new Image();

    this.menuOptions = ["Atacar", "Capturar", "Fugir"];
    this.pokemonData = pokemonData;
    this.qteActive = false;
    this.qteBarX = 0;
    this.qteInterval = null;

    this.assetsLoaded = 0;

    this.qte = {
      barWidth: 200,
      zoneStart: 80,
      zoneWidth: 40,
      speed: 5
    };
    this.fadeAlpha = 0;
    this.fadeInActive = false;

    window.addEventListener("keydown", (e) => this.handleMenuNavigation(e));
  }

  initBattle() {
    this.resetBattle()
    this.assetsLoaded = 0
    const meuInicial = this.pokemonData[1 ];
    console.log(meuInicial)
    const random2 = this.pokemonData[Math.floor(Math.random() * this.pokemonData.length)];

    this.playerPokemon = new Pokemon(meuInicial.name, meuInicial.hp, meuInicial.attack, meuInicial.imgBack);
    this.wildPokemon = new Pokemon(random2.name, random2.hp, random2.attack, random2.imgFront);

    this.playerPokemon.sprite.img = new Image();
    this.wildPokemon.sprite.img = new Image();

    this.message = `Um ${this.wildPokemon.name} selvagem apareceu!`;

    this.playerPokemon.sprite.img.onload = () => this.checkAssetsLoaded();
    this.wildPokemon.sprite.img.onload = () => this.checkAssetsLoaded();
    this.bgImage.onload = () => this.checkAssetsLoaded();
    this.barImage.onload = () => this.checkAssetsLoaded();

    this.playerPokemon.sprite.img.src = this.playerPokemon.sprite.imgURL;
    this.wildPokemon.sprite.img.src = this.wildPokemon.sprite.imgURL;
    this.bgImage.src = "assets/images/maps/battle_backgrounds_by_kwharever.png";
    this.barImage.src = "assets/images/maps/battle_bar.png";
  }

  checkAssetsLoaded() {
    this.assetsLoaded++;
    if (this.assetsLoaded >= 4) {
      // Começa o fade in
      this.fadeAlpha = 0;
      this.fadeInActive = true;
      this.fadeIn();

      setTimeout(() => {
        this.message = "";
        this.showMenu = true;
        this.drawBattle();
      }, 3000);
    }
  }

  fadeIn() {
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.02; // Velocidade do fade
      this.drawBattle();
      requestAnimationFrame(() => this.fadeIn());
    } else {
      this.fadeAlpha = 1;
      this.fadeInActive = false;
      this.drawBattle();
    }
  }

  drawBattle() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.globalAlpha = this.fadeAlpha;

    this.ctx.drawImage(this.bgImage, 2 * 240, 0, 240, 112, 0, 0, this.canvas.width, this.canvas.height * 0.7);
    this.ctx.drawImage(this.barImage, 0, 0, 240, 48, 0, this.canvas.height * 0.7,
      this.canvas.width, this.canvas.height * 0.3);

    const sw = this.playerPokemon.sprite.sourceWidth;
    const sh = this.playerPokemon.sprite.sourceHeight;

    const playerX = this.canvas.width * 0.25 - sw / 2;
    const playerY = this.canvas.height * 0.60 - sh / 2;
    const wildX = this.canvas.width * 0.72 - sw / 2;
    const wildY = this.canvas.height * 0.30 - sh / 2;

    this.ctx.drawImage(this.playerPokemon.sprite.img, playerX, playerY, sw, sh);
    this.ctx.drawImage(this.wildPokemon.sprite.img, wildX, wildY, sw, sh);

    this.drawHealthBar(this.playerPokemon, playerX, playerY + 10);
    this.drawHealthBar(this.wildPokemon, wildX, wildY + 10);

    
    this.ctx.fillStyle = "white";
    this.ctx.font = "12px PokemonFont";
    this.ctx.textAlign = "center";

    if (this.message) {
      this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height - 20);
    }

    if (this.inBattle && this.showMenu) this.drawMenu();
    if (this.qteActive) this.drawQTE();


  }

  drawHealthBar(pokemon, x, y) {
    const barWidth = 100;
    const hpPercent = pokemon.hp / pokemon.maxHp;

    this.ctx.fillStyle = "white";
    this.ctx.fillRect(x, y, barWidth, 10);
    this.ctx.fillStyle = hpPercent > 0.5 ? "green" : hpPercent > 0.2 ? "orange" : "red";
    this.ctx.fillRect(x, y, barWidth * hpPercent, 10);
  }

  drawMenu() {
    const menuY = 140;
    const spacing = this.canvas.width / (this.menuOptions.length + 1);

    for (let i = 0; i < this.menuOptions.length; i++) {
      const text = this.menuOptions[i];
      const x = spacing * (i + 1);

      this.ctx.fillStyle = "white";
      this.ctx.textAlign = "center";
      this.ctx.font = "10px monospace";

      this.ctx.fillText(text, x, menuY);
      if (i === this.selectedOption) {
        this.ctx.fillText("⮟", x, menuY - 10);
      }
    }
  }

  startQTE() {
    this.qteActive = true;
    this.qteBarX = 0;
    this.qteInterval = setInterval(() => {
      this.qteBarX += this.qte.speed;
      if (this.qteBarX >= this.qte.barWidth) this.qteBarX = 0;
      this.drawBattle();
    }, 30);
  }

  drawQTE() {
    const barX = (this.canvas.width - this.qte.barWidth) / 2;
    const barY = this.canvas.height * 0.8;

    this.ctx.fillStyle = "#ddd";
    this.ctx.fillRect(barX, barY, this.qte.barWidth, 20);

    this.ctx.fillStyle = "green";
    this.ctx.fillRect(barX + this.qte.zoneStart, barY, this.qte.zoneWidth, 20);

    this.ctx.fillStyle = "red";
    this.ctx.fillRect(barX + this.qteBarX, barY, 10, 20);

    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(barX, barY, this.qte.barWidth, 20);
  }

  resolveQTE() {
    clearInterval(this.qteInterval);
    this.qteActive = false;

    const relative = this.qteBarX;

    let multiplier;
    if (relative >= this.qte.zoneStart && relative <= this.qte.zoneStart + this.qte.zoneWidth) {
      multiplier = 1.0;
      this.message = "Acerto perfeito!";
    } else if (Math.abs(relative - (this.qte.zoneStart + this.qte.zoneWidth / 2)) <= 20) {
      multiplier = 0.7;
      this.message = "Acerto razoável!";
    } else {
      multiplier = 0.4;
      this.message = "Errou o tempo!";
    }

    const damage = Math.floor(this.playerPokemon.attack * multiplier);
    this.wildPokemon.hp -= damage;

    if (this.wildPokemon.hp <= 0) {
      this.wildPokemon.hp = 0;
      this.message += `\nVocê derrotou o ${this.wildPokemon.name}!`;

      this.inBattle = false;
    } else {
      this.playerTurn = false;
      setTimeout(() => this.enemyAttack(), 1000);
    }

    this.drawBattle();
  }

  attack() {
    if (!this.inBattle || !this.playerTurn) return;
    this.message = "Aperte [Z] no momento certo!";
    this.drawBattle();
    this.startQTE();
  }

  enemyAttack() {
    if (!this.wildPokemon.isAlive() || !this.inBattle) return;

    this.playerPokemon.hp -= this.wildPokemon.attack;
    if (this.playerPokemon.hp <= 0) {
      this.playerPokemon.hp = 0;
      this.message = `${this.playerPokemon.name} desmaiou!`;
      this.drawBattle()
      this.inBattle = false;
    } else {
      this.message = `${this.wildPokemon.name} atacou!`;
      this.drawBattle()
    }

    setTimeout(() => {
      this.message = "";
      this.showMenu = true;
      this.playerTurn = true;
      this.drawBattle();
    }, 1000);
  }

  tryCapture() {
    if (!this.inBattle || !this.playerTurn) return;
    this.showMenu = false
    const chance = Math.random();
    if (this.wildPokemon.hp < this.wildPokemon.maxHp / 2 && chance < 0.5) {
      this.message = `Você capturou o ${this.wildPokemon.name}!`;
      this.inBattle = false;
      setTimeout(() => this.endBattle(), 1000);
    } else {
      this.message = "A captura falhou!";

      this.playerTurn = false;
      setTimeout(() => this.enemyAttack(), 1000);
    }

    this.drawBattle();
  }

  flee() {
    if (!this.inBattle || !this.playerTurn) return;

    const chance = Math.random();
    if (chance < 0.5) {
      this.message = "Você fugiu da batalha!";
      this.showMenu = false
      this.drawBattle();
      setTimeout(() => this.endBattle(), 1000);
    } else {
      this.message = "Não conseguiu fugir!";
      this.showMenu = false
      this.playerTurn = false;
      this.drawBattle();
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }

  handleMenuNavigation(e) {
    if (this.qteActive && e.key.toLowerCase() === "z") {
      this.resolveQTE();
      return;
    }

    if (!this.showMenu) return;

    switch (e.key) {
      case "ArrowRight":
        this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
        this.drawBattle();
        break;
      case "ArrowLeft":
        this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
        this.drawBattle();
        break;
      case "Enter":
      case "z":
      case "Z":
        this.selectMenuOption();
        break;
    }
  }

  selectMenuOption() {
    switch (this.menuOptions[this.selectedOption]) {
      case "Atacar":
        this.attack();
        break;
      case "Capturar":
        this.tryCapture();
        break;
      case "Fugir":
        this.flee();
        break;
    }
    this.showMenu = false;
  }

  endBattle() {
    this.inBattle = false;
    console.log("Batalha encerrada.");
  }

  isInBattle() {
    return this.inBattle;
  }

  resetBattle() {
    this.playerTurn = true;
    this.inBattle = true;
    this.playerPokemon = null;
    this.wildPokemon = null;
    this.message = "";
    this.showMenu = false;
    this.selectedOption = 0
  }
}

export default Battle;
