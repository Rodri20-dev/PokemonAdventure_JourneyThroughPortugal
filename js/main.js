//main.js
import TitleScreen from './scenes/TitleScreen.js';
import GameEngine from './core/GameEngine.js';

var canvas;
let titleScreen;
let titleKeyHandler;
let gameEngine;


window.addEventListener("load", initGame, false);

function initGame() {
    canvas = document.getElementById("game-canvas");
    
    titleScreen = new TitleScreen(canvas);
    titleKeyHandler = titleScreen.handleKeyDown.bind(titleScreen);

    window.addEventListener("keydown", titleKeyHandler);

    gameLoop();
}

function gameLoop() {
    titleScreen.isActive ? (titleScreen.update(), requestAnimationFrame(gameLoop),
        titleScreen.render()) : startGame()
}

function startGame() {
    window.removeEventListener("keydown", titleKeyHandler);

    gameEngine = new GameEngine(canvas);
    gameEngine.start();
}

