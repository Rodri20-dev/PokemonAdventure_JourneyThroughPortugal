//main.js
import { Player } from './Entities/Player.js';
import CollisionDetector from "./core/CollisionDetector.js";
import { initBackgroundSwitcher } from './Core/Background.js';
import Intro from './Core/Intro.js'

initBackgroundSwitcher();
let introScreen;
var canvas;
var ctx;
var mapData;
var mapImg;
let activeKey = null;
let collisionDetector;
var player = undefined

window.addEventListener("load", initGame, false);

// Inicialização
function initGame() {
    // canvas e contexto
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    introScreen = new Intro(canvas, ctx); // Tela mostrada no inicio do jogo
    
    mapData = TileMaps["map-data"]; // Dados do mapa já carregados globalmente por map-data.js
    collisionDetector = new CollisionDetector(mapData); // Inicializa o CollisionDetector

    player = new Player()
    
    mapImg = new Image();
    player.sprite.img = new Image();

    mapImg.addEventListener("load", checkAssetsLoaded);
    player.sprite.img.addEventListener("load", checkAssetsLoaded);

    mapImg.src = 'assets/maps/pallet-town.png';
    player.sprite.img.src = player.sprite.imgURL;

    window.addEventListener("keydown", (e) => {
        introScreen.handleKeyDown(e);
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.code)) {
            activeKey = e.code;
        }
    });

    window.addEventListener("keyup", (e) => {
        if (e.code === activeKey) {
            activeKey = null;
            console.log(player.currentFrame) 
        }
    });
}

let assetsLoaded = 0;
function checkAssetsLoaded() {
    assetsLoaded++;
    if (assetsLoaded === 2) {
        loadHandler();
    }
}

function loadHandler() {
    gameLoop();
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    introScreen.isActive ? 
    (introScreen.update(), introScreen.render()) : (update(), render());
    
}

function update() {
    let newX = player.x;
    let newY = player.y;

    if (activeKey === "ArrowUp") {
        player.state = player.states.UP;
        newY -= player.speed;
    }
    if (activeKey === "ArrowDown") {
        player.state = player.states.DOWN;
        newY += player.speed;
    }
    if (activeKey === "ArrowLeft") {
        player.state = player.states.LEFT;
        newX -= player.speed;
    }
    if (activeKey === "ArrowRight") {
        player.state = player.states.RIGHT;
        newX += player.speed;
    }

    if (activeKey) {
        player.updateAnimation();
        render();
    }
    
    if (!collisionDetector.isColliding(newX, player.y, player.width, player.height)) {
    player.x = newX;
    }
    if (!collisionDetector.isColliding(player.x, newY, player.width, player.height)) {
        player.y = newY;
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
        player.sprite.img,
        player.sprite.sourceX, player.sprite.sourceY, player.sprite.sourceWidth, player.sprite.sourceHeight,
        dx, dy, player.width, player.height
    );
}