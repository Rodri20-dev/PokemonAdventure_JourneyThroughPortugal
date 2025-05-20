// js/main.js
import TitleScreen from './scenes/TitleScreen.js';
import GameEngine from './core/GameEngine.js';
import Sounds from './core/Sounds.js'; 

var canvas;
let titleScreen;
let titleKeyHandler;
let gameEngine;
let gameSounds; 

window.addEventListener("load", initGame, false);

function initGame() {
    canvas = document.getElementById("game-canvas");

    gameSounds = new Sounds(); 

    titleScreen = new TitleScreen(canvas);
    gameSounds.playSound("intro_theme.mp3");
    
    titleKeyHandler = titleScreen.handleKeyDown.bind(titleScreen);
    window.addEventListener("keydown", titleKeyHandler);
    gameLoop();
}

function gameLoop() {
    if (titleScreen && titleScreen.isActive) {
        titleScreen.update();
        titleScreen.render();
        requestAnimationFrame(gameLoop);
    } else {
        if (!gameEngine) { 
            startGame();
        }
    }
}

function startGame() {
    window.removeEventListener("keydown", titleKeyHandler);
    
    if (!gameEngine) {
        // NOVO: Passa a instância de gameSounds para GameEngine
        gameEngine = new GameEngine(canvas, gameSounds); 
    }
    
    gameEngine.start(); 
    gameSounds.playSound("map_theme.mp3"); // Lógica existente para a música do mapa, não alterada
}