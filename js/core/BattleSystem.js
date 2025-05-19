//BattleSystem.js
const canvas = document.getElementById('battleCanvas');
const ctx = canvas.getContext('2d');

// Mock de "sprites"
const playerPokemon = { x: 100, y: 200, color: 'red', radius: 30 };
const enemyPokemon = { x: 400, y: 100, color: 'blue', radius: 30 };

let attackAnimation = null;

function drawPokemon(pokemon) {
  ctx.beginPath();
  ctx.arc(pokemon.x, pokemon.y, pokemon.radius, 0, Math.PI * 2);
  ctx.fillStyle = pokemon.color;
  ctx.fill();
  ctx.closePath();
}

function drawBattle() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha os Pokémon
  drawPokemon(playerPokemon);
  drawPokemon(enemyPokemon);

  // Se houver animação de ataque
  if (attackAnimation) {
    ctx.beginPath();
    ctx.arc(attackAnimation.x, attackAnimation.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
  }
}

function animateAttack() {
  const startX = playerPokemon.x;
  const startY = playerPokemon.y;
  const endX = enemyPokemon.x;
  const endY = enemyPokemon.y;

  let t = 0;
  attackAnimation = { x: startX, y: startY };

  const interval = setInterval(() => {
    t += 0.02;
    if (t >= 1) {
      clearInterval(interval);
      attackAnimation = null;
      drawBattle();
      return;
    }

    attackAnimation.x = startX + (endX - startX) * t;
    attackAnimation.y = startY + (endY - startY) * t;

    drawBattle();
  }, 16); // ~60fps
}

function attack() {
  animateAttack();
}

drawBattle();
