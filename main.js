//main.js
import { Player } from './Entities/Player.js';
import CollisionDetector from "./core/CollisionDetector.js";
import { initBackgroundSwitcher } from './Core/Background.js';
import Intro from './Core/Intro.js';
import GameEngine from './Core/GameEngine.js'; // Importa GameEngine

initBackgroundSwitcher();

let introScreen;
let gameEngine;
var canvas;
var ctx;

window.addEventListener("load", initGame, false);

function initGame() {
    canvas = document.getElementById("game-canvas");
    ctx = canvas.getContext("2d");

    introScreen = new Intro(canvas, ctx, startGame); // Passa a função startGame para a Intro

    // Event listener para a tela de introdução
    window.addEventListener("keydown", introScreen.handleKeyDown.bind(introScreen));

    // O loop do jogo agora só gerencia a Intro até ela terminar
    gameLoop();
}

function startGame() {
    // Esta função será chamada pela Intro quando o jogador pressionar Enter
    gameEngine = new GameEngine(canvas);
    gameEngine.start();
    // Remove o listener da Intro e adiciona os listeners do GameEngine (se necessário)
    window.removeEventListener("keydown", introScreen.handleKeyDown.bind(introScreen));
    window.addEventListener("keydown", gameEngine.handleKeyDown.bind(gameEngine));
    window.addEventListener("keyup", gameEngine.handleKeyUp.bind(gameEngine));
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    if (introScreen.isActive) {
        introScreen.update();
        introScreen.render();
    }
    // O GameEngine só será atualizado e renderizado após startGame() ser chamado
    else if (gameEngine) {
        gameEngine.update();
        gameEngine.render();
    }
}