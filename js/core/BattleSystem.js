const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');

class Pokemon {
  constructor(name, hp, attack, imgSrc) {
    this.name = name;
    this.maxHp = hp;
    this.hp = hp;
    this.attack = attack;
    this.img = new Image();
    this.img.src = imgSrc;
  }

  isAlive() {
    return this.hp > 0;
  }
}

// Você pode trocar os caminhos das imagens
const playerPokemon = new Pokemon("Charmander", 100, 20, "assets/charmander_back.png");
const wildPokemon = new Pokemon("Pidgey", 60, 15, "assets/pidgey_front.png");

let message = "Um Pidgey selvagem apareceu!";
let playerTurn = true;
let battleOver = false;

// Desenha o estado atual da batalha
function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fundo simples
  ctx.fillStyle = "#C6F1E7";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Sprites
  ctx.drawImage(playerPokemon.img, 60, 200, 100, 100);
  ctx.drawImage(wildPokemon.img, 300, 50, 100, 100);

  // Barras de vida
  drawHealthBar(playerPokemon, 60, 180);
  drawHealthBar(wildPokemon, 300, 30);

  // Mensagem
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(message, 20, 360);
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

// Começa a batalha
playerPokemon.img.onload = () => {
  wildPokemon.img.onload = () => {
    drawBattle();
  };
};
