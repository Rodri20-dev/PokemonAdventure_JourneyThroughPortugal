import Pokemon from "../entities/Pokemon.js";

class Battle {
  constructor(canvas, pokemonData, player, gameSounds, npc) {
    // Inicializa o sistema de batalha com os elementos necessários:
    // - canvas: elemento onde a batalha será renderizada
    // - pokemonData: dados dos Pokémon disponíveis
    // - player: instância do jogador
    // - gameSounds: sistema de sons do jogo
    // - npc: instância do NPC (opcional, para batalhas contra NPC)
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Carrega imagens de fundo e barra de batalha
    this.bgImage = new Image();
    this.barImage = new Image();
    this.player = player;
    this.gameSounds = gameSounds;
    this.menuOptions = ["Atacar", "Capturar", "Fugir"]; // Opções do menu de batalha
    this.pokemonData = pokemonData;
    this.npc = npc;



    //parte do controlo
    this.gamepadIndex = 0;
    this.prevXButtonPressed = false;
    this.prevLeftPressed = false;
    this.prevRightPressed = false;





    // Adiciona listener para navegação no menu
    window.addEventListener("keydown", (e) => this.handleMenuNavigation(e));
  }

  initBattle(isNpcBattle = false) {
    // Inicializa uma batalha (normal ou contra NPC)
    this.isNpcBattle = isNpcBattle;
    this.initVariables(); // Configura variáveis iniciais

    // Configura Pokémon do NPC se for uma batalha contra NPC
    if (this.npc) {
      this.npc.pokemons = this.pokemonData.slice(0, 3); // NPC tem 3 Pokémon
      this.currentNpcIndex = 0; // Começa pelo primeiro Pokémon
    }

    // Configura o Pokémon inicial do jogador
    const meuInicial = this.player.pokemons[0];
    this.playerPokemon = meuInicial;
    this.playerPokemon.hp = this.playerPokemon.maxHp; // Restaura HP

    // Configura o Pokémon adversário (selvagem ou do NPC)
    if (isNpcBattle) {
      const poke = this.npc.pokemons[this.currentNpcIndex];
      this.wildPokemon = new Pokemon(poke.name, poke.hp, poke.attack, poke.imgFront, poke.imgBack);
    } else {
      // Escolhe um Pokémon selvagem aleatório
      const random = this.pokemonData[Math.floor(Math.random() * this.pokemonData.length)];
      this.wildPokemon = new Pokemon(random.name, random.hp, random.attack, random.imgFront, random.imgBack);
    }

    // Carrega sprites dos Pokémon
    this.playerPokemon.sprite.img = new Image();
    this.wildPokemon.sprite.img = new Image();

    // Define mensagem inicial baseada no tipo de batalha
    if (!isNpcBattle) {
      this.message = `Um ${this.wildPokemon.name} selvagem apareceu!`;
    } else {
      this.message = `A batalha contra o NPC começou!!`;
    }

    // Configura callbacks para quando os assets forem carregados
    this.playerPokemon.sprite.img.onload = () => this.checkAssetsLoaded();
    this.wildPokemon.sprite.img.onload = () => this.checkAssetsLoaded();
    this.bgImage.onload = () => this.checkAssetsLoaded();
    this.barImage.onload = () => this.checkAssetsLoaded();

    // Define sources para as imagens
    this.playerPokemon.sprite.img.src = this.playerPokemon.sprite.imgBack;
    this.wildPokemon.sprite.img.src = this.wildPokemon.sprite.imgFront;
    this.bgImage.src = "assets/images/maps/battle_backgrounds_by_kwharever.png";
    this.barImage.src = "assets/images/maps/battle_bar.png";
  }

  checkAssetsLoaded() {
    // Verifica se todos os assets foram carregados
    this.assetsLoaded++;
    if (this.assetsLoaded >= 4) { // 4 assets: 2 sprites + bg + bar
      this.fadeAlpha = 0;
      this.fadeInActive = true;
      this.fadeIn(); // Inicia animação de entrada
    }
  }

  fadeIn() {
    // Efeito de fade in para a batalha
    if (this.fadeAlpha < 1) {
      this.fadeAlpha += 0.02; // Aumenta gradualmente a opacidade
      this.render();
      requestAnimationFrame(() => this.fadeIn());
    } else {
      this.fadeAlpha = 1;
      this.fadeInActive = false;
      setTimeout(() => {
        this.message = "";
        this.showMenu = true; // Mostra o menu após o fade
        this.render();
      }, 1000);
    }
  }

  render() {
    // Renderiza toda a cena de batalha
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = this.fadeAlpha; // Aplica opacidade atual

    // Posicionamento dos sprites
    const sw = this.playerPokemon.sprite.sourceWidth;
    const sh = this.playerPokemon.sprite.sourceHeight;
    const playerX = this.canvas.width * 0.25 - sw / 2; // Posição do jogador
    const playerY = this.canvas.height * 0.60 - sh / 2;
    const wildX = this.canvas.width * 0.72 - sw / 2; // Posição do adversário
    const wildY = this.canvas.height * 0.30 - sh / 2;

    // Desenha fundo, sprites e barra de batalha
    this.ctx.drawImage(this.bgImage, 2 * 240, 0, 240, 112, 0, 0, this.canvas.width, this.canvas.height * 0.7);
    this.ctx.drawImage(this.playerPokemon.sprite.img, playerX, playerY, sw, sh);
    this.ctx.drawImage(this.wildPokemon.sprite.img, wildX, wildY, sw, sh);
    this.ctx.drawImage(this.barImage, 0, 0, 240, 48, 0, this.canvas.height * 0.7,
      this.canvas.width, this.canvas.height * 0.3);

    // Desenha barras de saúde
    this.drawHealthBar(this.playerPokemon, playerX, playerY + 10);
    this.drawHealthBar(this.wildPokemon, wildX, wildY + 10);

    // Desenha texto
    this.ctx.fillStyle = "white";
    this.ctx.font = "12px PokemonFont";
    this.ctx.textAlign = "center";

    if (this.message) {
      this.ctx.fillText(this.message, this.canvas.width / 2, this.canvas.height - 20);
    }

    // Desenha menu ou QTE se estiverem ativos
    if (this.inBattle && this.showMenu) this.drawMenu();
    if (this.qteActive) this.drawQTE();
  }

  drawHealthBar(pokemon, x, y) {
    // Desenha a barra de saúde do Pokémon
    const barWidth = 100;
    const hpPercent = pokemon.hp / pokemon.maxHp; // Calcula porcentagem de HP

    // Fundo da barra (branco)
    this.ctx.fillStyle = "white";
    this.ctx.fillRect(x, y, barWidth, 10);
    
    // Barra de HP (verde, laranja ou vermelho dependendo do HP)
    this.ctx.fillStyle = hpPercent > 0.5 ? "green" : hpPercent > 0.2 ? "orange" : "red";
    this.ctx.fillRect(x, y, barWidth * hpPercent, 10);
  }

  drawMenu() {
    // Desenha o menu de batalha
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
        this.ctx.fillText("⮟", x, menuY - 10); // Indicador de seleção
      }
    }
  }

  startQTE() {
    // Inicia o Quick Time Event (QTE) para ataques
    this.qteActive = true;
    this.qteBarX = 0;
    this.qteInterval = setInterval(() => {
      this.qteBarX += this.qte.speed; // Move a barra
      if (this.qteBarX >= this.qte.barWidth) this.qteBarX = 0; // Reinicia
      this.render();
    }, 30);
  }

  drawQTE() {
    // Desenha a barra do QTE
    const barX = (this.canvas.width - this.qte.barWidth) / 2;
    const barY = this.canvas.height * 0.8;

    // Barra cinza de fundo
    this.ctx.fillStyle = "#ddd";
    this.ctx.fillRect(barX, barY, this.qte.barWidth, 20);

    // Zona verde de acerto perfeito
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(barX + this.qte.zoneStart, barY, this.qte.zoneWidth, 20);

    // Indicador vermelho (que se move)
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(barX + this.qteBarX, barY, 10, 20);

    // Borda da barra
    this.ctx.strokeStyle = "black";
    this.ctx.strokeRect(barX, barY, this.qte.barWidth, 20);
  }

  resolveQTE() {
    // Resolve o QTE quando o jogador pressiona Enter
    clearInterval(this.qteInterval);
    this.qteActive = false;

    const relative = this.qteBarX;

    // Calcula o multiplicador de dano baseado na precisão do QTE
    let multiplier;
    if (relative >= this.qte.zoneStart && relative <= this.qte.zoneStart + this.qte.zoneWidth) {
      multiplier = 1.0; // Acerto perfeito
      this.message = "Acerto perfeito!";
    } else if (Math.abs(relative - (this.qte.zoneStart + this.qte.zoneWidth / 2)) <= 20) {
      multiplier = 0.7; // Acerto razoável
      this.message = "Acerto razoável!";
    } else {
      multiplier = 0.4; // Errou
      this.message = "Errou o tempo!";
    }

    // Aplica dano ao Pokémon adversário
    const damage = Math.floor(this.playerPokemon.attack * multiplier);
    this.wildPokemon.hp -= damage;

    // Verifica se o Pokémon adversário foi derrotado
    if (this.wildPokemon.hp <= 0) {
      this.wildPokemon.hp = 0;
      this.message += `\nVocê derrotou o ${this.wildPokemon.name}!`;
      this.render();

      if (this.isNpcBattle) {
        setTimeout(() => this.switchToNextNpcPokemon(), 1000); // Próximo Pokémon do NPC
      } else {
        setTimeout(() => this.endBattle(), 1000); // Fim da batalha selvagem
      }
    } else {
      this.playerTurn = false;
      setTimeout(() => this.enemyAttack(), 1000); // Vez do adversário
    }

    this.render();
  }

  attack() {
    // Inicia o ataque do jogador
    if (!this.inBattle || !this.playerTurn) return;
    this.message = "Aperte [Enter] no momento certo!";
    this.startQTE(); // Inicia o QTE
    this.render();
  }

  enemyAttack() {
    // Executa o ataque do inimigo
    if (!this.wildPokemon.isAlive() || !this.inBattle) return;

    this.playerPokemon.hp -= this.wildPokemon.attack; // Aplica dano

    // Verifica se o Pokémon do jogador foi derrotado
    if (!this.playerPokemon.isAlive()) {
      this.playerPokemon.hp = 0;
      this.message = `${this.playerPokemon.name} desmaiou!`;

      let index = this.player.pokemons.indexOf(this.playerPokemon);
      if (index < this.player.pokemons.length - 1) {
        // Troca para o próximo Pokémon do jogador
        this.playerPokemon = this.player.pokemons[index + 1];
        this.playerPokemon.hp = this.playerPokemon.maxHp;
        this.playerPokemon.sprite.img = new Image();
        this.playerPokemon.sprite.img.onload = () => {
          this.message = `${this.playerPokemon.name}, eu escolho você!`;
          this.render();
        };
        this.playerPokemon.sprite.img.src = this.playerPokemon.sprite.imgBack;
      } else {
        // Sem mais Pokémon disponíveis
        this.message = "Você não tem mais Pokémon disponível!";
        this.render();
        setTimeout(() => this.endBattle(), 1000);
        return;
      }
    } else {
      this.message = `${this.wildPokemon.name} atacou!`;
      this.render();
    }

    // Prepara o próximo turno
    setTimeout(() => {
      this.message = "";
      this.showMenu = true;
      this.playerTurn = true;
      this.render();
    }, 1000);
  }

  tryCapture() {
    // Tenta capturar o Pokémon selvagem
    if (!this.inBattle || !this.playerTurn) return;

    this.showMenu = false;
    const chance = Math.random();
    if (!this.isNpcBattle) {
      // Só pode capturar Pokémon selvagens (não NPC)
      if (this.wildPokemon.hp < this.wildPokemon.maxHp / 2 && chance < 0.7) {
        // Maior chance se o Pokémon estiver com menos da metade do HP
        this.message = `Você capturou o ${this.wildPokemon.name}!`;
        this.player.pokemons.push(this.wildPokemon); // Adiciona à equipe
        setTimeout(() => this.endBattle(), 1000);
      } else {
        this.message = "A captura falhou!";
        this.playerTurn = false;
        setTimeout(() => this.enemyAttack(), 1000);
      }
    } else {
      this.message = "Nao pode capturar o pokemon do NPC!";
      setTimeout(() => this.enemyAttack(), 1000);
    }
    this.endTurn();
    this.render();
  }

  flee() {
    // Tenta fugir da batalha
    if (!this.inBattle || !this.playerTurn) return;

    const chance = Math.random();
    if (!this.isNpcBattle) {
      if (chance < 0.5) { // 50% de chance de fugir
        this.message = "Você fugiu da batalha!";
        this.showMenu = false;
        this.render();
        setTimeout(() => this.endBattle(), 1000);
      } else {
        this.message = "Não conseguiu fugir!";
        this.showMenu = false;
        this.playerTurn = false;
        this.render();
        setTimeout(() => this.enemyAttack(), 1000);
      }
    } else {
      // Não pode fugir de batalha contra NPC
      this.message = "Você não pode fugir do NPC!";
      this.endTurn();
      this.render();
      setTimeout(() => this.enemyAttack(), 1000);
    }
  }

  endTurn() {
    // Finaliza o turno do jogador
    this.playerTurn = false;
    this.showMenu = false;
  }

  handleMenuNavigation(e) {
    // Manipula a navegação no menu de batalha
    if (this.qteActive && e.code === "Enter") {
      this.resolveQTE(); // Enter durante QTE resolve o ataque
      return;
    }

    if (!this.showMenu) return;

    switch (e.code) {
      case "ArrowRight":
        // Move para a opção à direita
        this.selectedOption = (this.selectedOption + 1) % this.menuOptions.length;
        this.render();
        break;
      case "ArrowLeft":
        // Move para a opção à esquerda
        this.selectedOption = (this.selectedOption - 1 + this.menuOptions.length) % this.menuOptions.length;
        this.render();
        break;
      case "Enter":
        // Seleciona a opção atual
        this.selectMenuOption();
        break;
    }
  }




  //converter inout do controlo
  handleGamepadInput() {
    const gamepads = navigator.getGamepads();
    const gp = gamepads[this.gamepadIndex];
    if (!gp) return;

    // Botão X (índice 0) = "Enter"
    const xButton = gp.buttons[0];
    if (xButton.pressed && !this.prevXButtonPressed) {
        this.handleMenuNavigation({ code: "Enter" });
    }
    this.prevXButtonPressed = xButton.pressed;

    // Botões de direção
    const leftButton = gp.buttons[14]; // D-Pad Left
    const rightButton = gp.buttons[15]; // D-Pad Right

    // Previne múltiplos eventos no mesmo pressionamento
    if (rightButton.pressed && !this.prevRightPressed) {
        this.handleMenuNavigation({ code: "ArrowRight" });
    }
    if (leftButton.pressed && !this.prevLeftPressed) {
        this.handleMenuNavigation({ code: "ArrowLeft" });
    }

    this.prevRightPressed = rightButton.pressed;
    this.prevLeftPressed = leftButton.pressed;
}







  selectMenuOption() {
    // Executa a ação correspondente à opção selecionada
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
    // Finaliza a batalha
    this.inBattle = false;
    this.gameSounds.playSound("map_theme.mp3"); // Volta para música do mapa
  }

  switchToNextNpcPokemon() {
    // Troca para o próximo Pokémon do NPC
    this.currentNpcIndex++;
    if (this.currentNpcIndex < this.npc.pokemons.length) {
      const next = this.npc.pokemons[this.currentNpcIndex];
      this.wildPokemon = new Pokemon(next.name, next.hp, next.attack, next.imgFront, next.imgBack);
      this.wildPokemon.sprite.img = new Image();
      this.wildPokemon.sprite.img.onload = () => {
        this.message = `${this.wildPokemon.name} entrou na batalha!`;
        this.render();

        setTimeout(() => {
          this.message = "";
          this.showMenu = true;
          this.render();
        }, 1000);
      };
      this.wildPokemon.sprite.img.src = this.wildPokemon.sprite.imgFront;
    } else {
      // NPC sem mais Pokémon - fim da batalha
      this.endBattle();
    }
  }

  isInBattle() {
    // Verifica se está em batalha
    return this.inBattle;
  }

  initVariables() {
    // Inicializa variáveis da batalha
    let zStart = this.isNpcBattle ? 90 : 80;
    let zWidth = this.isNpcBattle ? 10 : 40;
    this.playerTurn = true; // Jogador começa
    this.inBattle = true;
    this.wildPokemon = null;
    this.message = "";
    this.showMenu = false;
    this.selectedOption = 0;
    this.qteActive = false;
    this.qteBarX = 0;
    this.qteInterval = null;
    this.assetsLoaded = 0;
    this.fadeAlpha = 0;
    this.fadeInActive = false;
    this.qte = { // Configurações do QTE
      barWidth: 200,
      zoneStart: zStart, // Posição da zona de acerto
      zoneWidth: zWidth, // Largura da zona
      speed: 5 // Velocidade da barra
    };
  }
}

export default Battle;