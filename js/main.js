// js/main.js
import TitleScreen from './scenes/TitleScreen.js';
import GameEngine from './core/GameEngine.js';
import Sounds from './core/Sounds.js';

var canvas;
let titleScreen;
let titleKeyHandler;
let gameEngine;
let gameSounds;
let gameData = {}; 

window.addEventListener("load", initGame, false);

function initGame() {
    loadGameData()
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
        gameEngine = new GameEngine(canvas, gameData); 
    }

    gameEngine.start();
    gameSounds.playSound("map_theme.mp3");
}

async function loadGameData() {
    const indexRes = await fetch('data/index.json');
    const indexData = await indexRes.json();

    const pokemonRes = await fetch(`data/${indexData.pokemon}`);
    gameData.pokemon = await pokemonRes.json();

    gameData.maps = {};
    for (let i = 0; i < indexData.maps.length; i++) {
        const res = await fetch(`data/${indexData.maps[i]}`);
        const data = await res.json();
        gameData.maps[indexData.maps[i].replace('-data.json', '')] = data;
    }
}