//BattleSystem.js
import Pokemon from "../entities/Pokemon.js";

const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');
let bgImage = new Image()
// Você pode trocar os caminhos das imagens


let playerTurn = true;
let battleOver = false;
let playerPokemon
let wildPokemon
let message

const menuOptions = ["Atacar", "Capturar", "Fugir"];
let selectedOption = 0;
let showMenu = true;
let pokemonData = null;

window.addEventListener("load", loadPokemonData, false);

async function loadPokemonData() {
  try {
    const response = await fetch("./data/pokemon-data.json");
    if (!response.ok) {
      throw new Error("Falha ao carregar os dados dos Pokémons.");
    }
    pokemonData = await response.json();
    console.log(pokemonData)
    initGame();
  } catch (error) {
    console.error("Erro ao carregar os dados dos Pokémons:", error);
  }
}

function initGame() {
  const meuInicial = pokemonData[1];
  const random2 = pokemonData[Math.floor(Math.random() * pokemonData.length)];

  playerPokemon = new Pokemon(meuInicial.name, meuInicial.hp, meuInicial.hp, meuInicial.imgBack);
  wildPokemon = new Pokemon(random2.name, random2.hp, random2.hp, random2.imgFront);

  playerPokemon.sprite.img = new Image()
  wildPokemon.sprite.img = new Image()

  message = `Um ${wildPokemon.name} selvagem apareceu!`;

  playerPokemon.sprite.img.onload = () => {
    checkAssetsLoaded();
  };
  wildPokemon.sprite.img.onload = () => {
    checkAssetsLoaded();
  };
  bgImage.onload = () => {
    checkAssetsLoaded();
  }

  playerPokemon.sprite.img.src = playerPokemon.sprite.imgURL
  wildPokemon.sprite.img.src = wildPokemon.sprite.imgURL
  bgImage.src = "assets/images/maps/battle_backgrounds_by_kwharever.png"
}

let assetsLoaded = 0
function checkAssetsLoaded() {
  assetsLoaded++;
  if (assetsLoaded === 3) {
    drawBattle()
  }
}

// Desenha o estado atual da batalha
function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Fundo
  ctx.drawImage(bgImage, 2 * 240, 0, 240, 112,
    0, 0, canvas.width, canvas.height * 0.7)

  const pokemonSpriteWidth = playerPokemon.sprite.sourceWidth;
  const pokemonSpriteHeight = playerPokemon.sprite.sourceHeight;

  // Posicionamento dinâmico dos sprites:
  // Player fica perto do canto inferior esquerdo, com margem proporcional
  const playerX = canvas.width * 0.25 - pokemonSpriteWidth / 2;
  const playerY = canvas.height * 0.60 - pokemonSpriteHeight / 2;

  // Wild fica perto do canto superior direito, também com margem proporcional
  const wildX = canvas.width * 0.72 - pokemonSpriteWidth / 2;
  const wildY = canvas.height * 0.30 - pokemonSpriteHeight / 2;

  // Desenha sprites
  ctx.drawImage(playerPokemon.sprite.img, playerX, playerY, pokemonSpriteWidth, pokemonSpriteHeight);
  ctx.drawImage(wildPokemon.sprite.img, wildX, wildY, pokemonSpriteWidth, pokemonSpriteHeight);

  // HP bars, posicionadas acima dos pokemons
  drawHealthBar(playerPokemon, playerX, playerY + 10);
  drawHealthBar(wildPokemon, wildX, wildY + 10);

  // Mensagem, centralizada na parte inferior
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height - 20);

  // Menu
  if (!battleOver && showMenu) {
    drawMenu();
  }
}

function drawMenu() {
  // Definir largura e altura do menu proporcional ao canvas
  const menuWidth = canvas.width;   // 95% da largura do canvas
  const menuHeight = canvas.height * 0.3;  // 20% da altura do canvas

  // Posição na parte inferior, com uma pequena margem
  const menuX = 0;
  const menuY = 112;

  // Fundo do menu
  ctx.fillStyle = "#fff";
  ctx.fillRect(menuX, menuY, menuWidth, menuHeight);

  // Borda do menu
  ctx.strokeStyle = "black";
  ctx.strokeRect(menuX, menuY, menuWidth, menuHeight);

  // Texto do menu

  ctx.fillStyle = "black";
  ctx.font = `${Math.floor(menuHeight / (menuOptions.length + 1))}px Arial`; // tamanho de fonte relativo ao menu
  ctx.textBaseline = "top";

  for (let i = 0; i < menuOptions.length; i++) {
    const text = menuOptions[i];
    // Espaçamento vertical proporcional dentro do menu
    const textX = menuX + 40;
    const textY = menuY + 10 + i * (menuHeight / menuOptions.length);

    ctx.fillText(text, textX, textY);

    if (i === selectedOption) {
      // Seta indicadora um pouco antes do texto
      ctx.fillText("➤", textX - 20, textY);
    }
  }
}



function drawHealthBar(pokemon, x, y) {
  const barWidth = 100;
  const hpPercent = pokemon.hp / pokemon.maxHp;

  ctx.fillStyle = "black";
  ctx.fillRect(x, y, barWidth, 10);
  ctx.fillStyle = hpPercent > 0.5 ? "green" : hpPercent > 0.2 ? "orange" : "red";
  ctx.fillRect(x, y, barWidth * hpPercent, 10);
}

function attack() {
  if (battleOver || !playerTurn) return;

  wildPokemon.hp -= playerPokemon.attack;
  message = `${playerPokemon.name} atacou!`;

  if (wildPokemon.hp <= 0) {
    wildPokemon.hp = 0;
    message = `Você derrotou o ${wildPokemon.name}!`;
    battleOver = true;
  } else {
    playerTurn = false;
    setTimeout(enemyAttack, 1000);
  }

  drawBattle();
}

function enemyAttack() {
  if (!wildPokemon.isAlive() || battleOver) return;

  playerPokemon.hp -= wildPokemon.attack;
  message = `${wildPokemon.name} atacou!`;

  if (playerPokemon.hp <= 0) {
    playerPokemon.hp = 0;
    message = `${playerPokemon.name} desmaiou!`;
    battleOver = true;
  }

  playerTurn = true;
  drawBattle();
}

function tryCapture() {
  if (battleOver || !playerTurn) return;

  const chance = Math.random();

  if (wildPokemon.hp < wildPokemon.maxHp / 2 && chance < 0.5) {
    message = `Você capturou o ${wildPokemon.name}!`;
    battleOver = true;
  } else {
    message = "A captura falhou!";
    playerTurn = false;
    setTimeout(enemyAttack, 1000);
  }

  drawBattle();
}

function flee() {
  if (battleOver || !playerTurn) return;

  const chance = Math.random();

  if (chance < 0.5) {
    message = "Você fugiu da batalha!";
    battleOver = true;
  } else {
    message = "Não conseguiu fugir!";
    playerTurn = false;
    setTimeout(enemyAttack, 1000);
  }

  drawBattle();
}

window.addEventListener("keydown", handleMenuNavigation);

function handleMenuNavigation(e) {
  if (battleOver || !showMenu || !playerTurn) return;

  switch (e.key) {
    case "ArrowUp":
      selectedOption = (selectedOption - 1 + menuOptions.length) % menuOptions.length;
      drawBattle();
      break;
    case "ArrowDown":
      selectedOption = (selectedOption + 1) % menuOptions.length;
      drawBattle();
      break;
    case "Enter":
      executeAction(menuOptions[selectedOption]);
      break;
    case "x":
    case "Backspace":
      message = "Você cancelou!";
      showMenu = false;
      drawBattle();
      setTimeout(() => {
        showMenu = true;
        drawBattle();
      }, 1000);
      break;
  }
}


function executeAction(option) {
  if (battleOver || !playerTurn) return;

  showMenu = false;

  switch (option) {
    case "Atacar":
      attack();
      break;
    case "Capturar":
      tryCapture();
      break;
    case "Fugir":
      flee();
      break;
  }

  // Se ainda houver batalha, mostrar o menu de novo após a ação
  if (!battleOver) {
    setTimeout(() => {
      if (playerTurn) {
        showMenu = true;
        drawBattle();
      }
    }, 1500);
  }
}

