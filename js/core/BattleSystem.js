import Pokemon from "../entities/Pokemon.js";

const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');
let bgImage = new Image();
let barImage = new Image();
let playerTurn = true;
let battleOver = false;
let playerPokemon;
let wildPokemon;
let message;

const menuOptions = ["Atacar", "Capturar", "Fugir"];
let selectedOption = 0;
let showMenu = true;
let pokemonData = null;
let qteActive = false;
let qteBarX = 0;
let qteInterval = null;

const qte = {
  barWidth: 200,
  zoneStart: 80,
  zoneWidth: 40,
  speed: 5
};

window.addEventListener("load", loadPokemonData, false);

async function loadPokemonData() {
  try {
    const response = await fetch("./data/pokemon-data.json");
    if (!response.ok) throw new Error("Falha ao carregar os dados dos Pokémons.");
    pokemonData = await response.json();
    initGame();
  } catch (error) {
    console.error("Erro ao carregar os dados dos Pokémons:", error);
  }
}

function initGame() {
  const meuInicial = pokemonData[1];
  const random2 = pokemonData[Math.floor(Math.random() * pokemonData.length)];

  playerPokemon = new Pokemon(meuInicial.name, meuInicial.hp, meuInicial.zttack, meuInicial.imgBack);
  wildPokemon = new Pokemon(random2.name, random2.hp, random2.attack, random2.imgFront);

  playerPokemon.sprite.img = new Image();
  wildPokemon.sprite.img = new Image();

  message = `Um ${wildPokemon.name} selvagem apareceu!`;

  playerPokemon.sprite.img.onload = checkAssetsLoaded;
  wildPokemon.sprite.img.onload = checkAssetsLoaded;
  bgImage.onload = checkAssetsLoaded;
  barImage.onload = checkAssetsLoaded
  playerPokemon.sprite.img.src = playerPokemon.sprite.imgURL;
  wildPokemon.sprite.img.src = wildPokemon.sprite.imgURL;
  bgImage.src = "assets/images/maps/battle_backgrounds_by_kwharever.png";
  barImage.src = "assets/images/maps/battle_bar.png";
}

let assetsLoaded = 0;
function checkAssetsLoaded() {
  assetsLoaded++;
  if (assetsLoaded === 4) {
    drawBattle();
  }
}

function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(bgImage, 2 * 240, 0, 240, 112, 0, 0, canvas.width, canvas.height * 0.7);
  ctx.drawImage(barImage, 0, 0, 240, 48, 0, canvas.height * 0.7, 
    canvas.width, canvas.height * 0.3);

  const sw = playerPokemon.sprite.sourceWidth;
  const sh = playerPokemon.sprite.sourceHeight;

  const playerX = canvas.width * 0.25 - sw / 2;
  const playerY = canvas.height * 0.60 - sh / 2;
  const wildX = canvas.width * 0.72 - sw / 2;
  const wildY = canvas.height * 0.30 - sh / 2;

  ctx.drawImage(playerPokemon.sprite.img, playerX, playerY, sw, sh);
  ctx.drawImage(wildPokemon.sprite.img, wildX, wildY, sw, sh);

  drawHealthBar(playerPokemon, playerX, playerY + 10);
  drawHealthBar(wildPokemon, wildX, wildY + 10);

  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.textAlign = "center";
  ctx.fillText(message, canvas.width / 2, canvas.height - 20);

  if (!battleOver && showMenu) drawMenu();
  if (qteActive) drawQTE();
}

function drawHealthBar(pokemon, x, y) {
  const barWidth = 100;
  const hpPercent = pokemon.hp / pokemon.maxHp;

  ctx.fillStyle = "black";
  ctx.fillRect(x, y, barWidth, 10);
  ctx.fillStyle = hpPercent > 0.5 ? "green" : hpPercent > 0.2 ? "orange" : "red";
  ctx.fillRect(x, y, barWidth * hpPercent, 10);
}

function drawMenu() {
  const menuWidth = canvas.width;
  const menuHeight = canvas.height * 0.3;
  const menuY = 112;


  for (let i = 0; i < menuOptions.length; i++) {
    const text = menuOptions[i];
    const textX = 40;
    const textY = menuY + 10 + i * (menuHeight / menuOptions.length);
    ctx.fillText(text, textX, textY);
    if (i === selectedOption) ctx.fillText("➤", textX - 20, textY);
  }
}

function startQTE() {
  qteActive = true;
  qteBarX = 0;
  qteInterval = setInterval(() => {
    qteBarX += qte.speed;
    if (qteBarX > qte.barWidth) qteBarX = 0;
    drawBattle();
  }, 30);
}

function drawQTE() {
  const barX = (canvas.width - qte.barWidth) / 2;
  const barY = canvas.height * 0.75;

  ctx.fillStyle = "#ddd";
  ctx.fillRect(barX, barY, qte.barWidth, 20);

  ctx.fillStyle = "green";
  ctx.fillRect(barX + qte.zoneStart, barY, qte.zoneWidth, 20);

  ctx.fillStyle = "red";
  ctx.fillRect(barX + qteBarX, barY, 10, 20);

  ctx.strokeStyle = "black";
  ctx.strokeRect(barX, barY, qte.barWidth, 20);
}

function resolveQTE() {
  clearInterval(qteInterval);
  qteActive = false;

  const barX = (canvas.width - qte.barWidth) / 2;
  const relative = qteBarX;

  let multiplier;
  if (relative >= qte.zoneStart && relative <= qte.zoneStart + qte.zoneWidth) {
    multiplier = 1.0;
    message = "Acerto perfeito!";
  } else if (Math.abs(relative - (qte.zoneStart + qte.zoneWidth / 2)) <= 20) {
    multiplier = 0.7;
    message = "Acerto razoável!";
  } else {
    multiplier = 0.4;
    message = "Errou o tempo!";
  }

  const damage = Math.floor(playerPokemon.attack * multiplier);
  wildPokemon.hp -= damage;

  if (wildPokemon.hp <= 0) {
    wildPokemon.hp = 0;
    message += `\nVocê derrotou o ${wildPokemon.name}!`;
    battleOver = true;
  } else {
    playerTurn = false;
    setTimeout(enemyAttack, 1000);
  }

  drawBattle();
}

function attack() {
  if (battleOver || !playerTurn) return;
  message = "Aperte [Z] no momento certo!";
  drawBattle();
  startQTE();
}

function enemyAttack() {
  if (!wildPokemon.isAlive() || battleOver) return;

  playerPokemon.hp -= wildPokemon.attack;
  if (playerPokemon.hp <= 0) {
    playerPokemon.hp = 0;
    message = `${playerPokemon.name} desmaiou!`;
    battleOver = true;
  } else {
    message = `${wildPokemon.name} atacou!`;
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
  if (qteActive && e.key.toLowerCase() === "z") {
    resolveQTE();
    return;
  }

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

  if (!battleOver && option !== "Atacar") {
    setTimeout(() => {
      if (playerTurn) {
        showMenu = true;
        drawBattle();
      }
    }, 1500);
  }
}
