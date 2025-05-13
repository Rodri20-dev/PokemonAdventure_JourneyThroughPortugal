var canvas;
var ctx;
var mapData; 
var mapImg;
var playerImg;
let activeKey = null;

// Objeto do jogador
const player = {
  sprite: {
    sourceX: 0,
    sourceY: 0,
    width: 48,
    height: 64
  },
  x: 160,
  y: 128,
  speed: 1,
  width: 24,
  height: 32,
  numberOfFrames: 4,
  currentFrame: 0,
  states: {
    DOWN: 0,
    LEFT: 1,
    RIGHT: 2,
    UP: 3
  },
  state: 0,
  animationCounter: 0,
  animationSpeed: 8,
  updateAnimation: function() {

    this.animationCounter++

    if (this.animationCounter >= this.animationSpeed) {
      
    
    this.currentFrame = (this.currentFrame + 1) % this.numberOfFrames;
    this.sprite.sourceX = this.currentFrame * player.sprite.width;
    this.sprite.sourceY = this.state * this.sprite.height;

    this.animationCounter = 0; // reset contador
    }

    render();
  }
};


// Controles
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

window.addEventListener("load", initGame, false);

// Inicialização
function initGame() {
  // canvas e contexto
  canvas = document.getElementById("game-canvas");
  ctx = canvas.getContext("2d");

  //dados do mapa
  mapData = TileMaps["map-data"];

  //imagens
  mapImg = new Image();
  playerImg = new Image();

  mapImg.addEventListener("load", checkAssetsLoaded)
  playerImg.addEventListener("load", checkAssetsLoaded)

  mapImg.src = 'assets/maps/pallet-town.png';
  playerImg.src = 'assets/characters/player.png';



  window.addEventListener("keydown", (e) => {
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
      activeKey = e.code;
    }
  });

  window.addEventListener("keyup", (e) => {
    if (e.code === activeKey) {
      activeKey = null;
    }
  });

}

let assetsLoaded = 0
function checkAssetsLoaded() {
  assetsLoaded++
  if(assetsLoaded === 2) {
    loadHandler()
  }
}

function loadHandler() {
  initCollisionTiles();
  gameLoop();
}


// Sistema de colisão
const collisionTiles = {};

function initCollisionTiles() {
  const tileset = mapData.tilesets[0];
  tileset.tiles.forEach(tile => {
    if (tile.properties) {
      const collideProp = tile.properties.find(p => p.name === 'collide' && p.value);
      if (collideProp) {
        collisionTiles[tile.id + tileset.firstgid] = true;
      }
    }
  });
}

function isColliding(x, y) {
  const tileX = Math.floor(x / mapData.tilewidth);
  const tileY = Math.floor(y / mapData.tileheight);
  
  if (tileX < 0 || tileX >= mapData.width || tileY < 0 || tileY >= mapData.height) {
    return true;
  }
  
  const index = tileY * mapData.width + tileX;
  const tileId = mapData.layers[0].data[index];
  return collisionTiles[tileId];
}




function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}


function update() {
  let newX = player.x;
  let newY = player.y;

  if (activeKey === "ArrowUp") {
    newY -= player.speed;
    player.state = player.states.UP;
  } 
  if (activeKey === "ArrowDown") {
    newY += player.speed;
    player.state = player.states.DOWN;
  }
  if (activeKey === "ArrowLeft") {
    newX -= player.speed;
    player.state = player.states.LEFT;
  } 
  if (activeKey === "ArrowRight") {
    newX += player.speed;
    player.state = player.states.RIGHT;
  }

  if (!isColliding(newX, player.y)) player.x = newX;
  if (!isColliding(player.x, newY)) player.y = newY;

  if (activeKey) {
    player.updateAnimation();
  }

}



function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  const camX = player.x - canvas.width / 2;
  const camY = player.y - canvas.height / 2;
  
  ctx.drawImage(
    mapImg,
    -camX, -camY,
    mapData.width * mapData.tilewidth,
    mapData.height * mapData.tileheight
  );
  
  const dx = (canvas.width - player.width) / 2;
  const dy = (canvas.height - player.height) / 2;
  ctx.drawImage(
    playerImg,
    player.sprite.sourceX, player.sprite.sourceY, player.sprite.width, player.sprite.height,
    dx, dy, player.width, player.height
  );
}
