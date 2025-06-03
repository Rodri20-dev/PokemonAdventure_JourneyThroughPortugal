// js/main.js
import TitleScreen from './scenes/TitleScreen.js';
import GameEngine from './core/GameEngine.js';
import Sounds from './core/Sounds.js';

// Variáveis globais
var canvas; // Elemento canvas do jogo
let titleScreen; // Tela de título
let titleKeyHandler; // Handler de teclas para tela de título
let gameEngine; // Motor do jogo
let gameSounds; // Sistema de sons
let gameData = {}; // Dados do jogo (carregados de arquivos JSON)

// Inicia o jogo quando a página carrega
window.addEventListener("load", initGame, false);

function initGame() {
    loadGameData(); // Carrega dados do jogo
    canvas = document.getElementById("game-canvas");
    gameSounds = new Sounds(); // Inicializa sistema de sons
    titleScreen = new TitleScreen(canvas); // Cria tela de título
    gameSounds.playSound("intro_theme.mp3"); // Toca música de introdução

    // Configura handler de teclas para tela de título
    titleKeyHandler = titleScreen.handleKeyDown.bind(titleScreen);
    window.addEventListener("keydown", titleKeyHandler);
    gameLoop(); // Inicia loop do jogo
}

function gameLoop() {
    // Loop principal
    if (titleScreen && titleScreen.isActive) {
        // Se a tela de título estiver ativa, atualiza e renderiza ela
        titleScreen.update();
        titleScreen.render();
        requestAnimationFrame(gameLoop);
    } else {
        // Se não, inicia o jogo principal
        if (!gameEngine) {
            startGame();
        }
    }
}

function startGame() {
    // Inicia o jogo principal
    window.removeEventListener("keydown", titleKeyHandler); // Remove handler da tela de título

    if (!gameEngine) {
        // Cria motor do jogo se não existir
        gameEngine = new GameEngine(canvas, gameData, gameSounds); 
    }

    gameEngine.start(); // Inicia o motor
    gameSounds.playSound("map_theme.mp3"); // Toca música do mapa
}

async function loadGameData() {
    // Carrega dados do jogo de arquivos JSON
    const indexRes = await fetch('data/index.json'); // Arquivo índice
    const indexData = await indexRes.json();

    // Carrega dados dos Pokémon
    const pokemonRes = await fetch(`data/${indexData.pokemon}`);
    gameData.pokemon = await pokemonRes.json();

    // Carrega dados dos mapas
    gameData.maps = {};
    for (let i = 0; i < indexData.maps.length; i++) {
        const res = await fetch(`data/${indexData.maps[i]}`);
        const data = await res.json();
        gameData.maps[indexData.maps[i].replace('-data.json', '')] = data;
    }
}