/**
 * Classe que gerencia transições entre cenas/mapas.
 */
class SceneManager {
    constructor(gameEngine) {
        // Referências importantes
        this.gameEngine = gameEngine;
        this.canvas = gameEngine.canvas;
        this.ctx = gameEngine.ctx;
        
        // Estado da transição
        this.isTransitioning = false; // Flag de transição ativa
        this.transitionAlpha = 1;      // Opacidade do efeito de transição
        this.transitionSpeed = 0.05;   // Velocidade da transição
        this.transitionPhase = null;   // Fase da transição ("out" ou "in")
        this.targetMap = null;         // Mapa de destino
        this.transitionCallback = null; // Callback após transição
        
        // Áreas de transição no mapa
        this.triggerAreas = [];
    }

    /**
     * Adiciona uma área que dispara transição para outro mapa
     * @param {number} x - Posição X em tiles
     * @param {number} y - Posição Y em tiles
     * @param {number} width - Largura em tiles
     * @param {number} height - Altura em tiles
     * @param {string} targetMap - Nome do mapa de destino
     */
    addTransitionArea(x, y, width, height, targetMap) {
        // Converte coordenadas de tile para pixels
        this.triggerAreas.push({ 
            x: x * 16, 
            y: y * 16, 
            width: width * 16, 
            height: height * 16, 
            targetMap 
        });
    }

    /**
     * Limpa todas as áreas de transição
     */
    clearTransitionAreas() { 
        this.triggerAreas = [];
    }

    /**
     * Verifica se o jogador entrou em alguma área de transição
     * @param {number} playerX - Posição X do jogador
     * @param {number} playerY - Posição Y do jogador
     */
    checkTransitionAreas(playerX, playerY) {
        if (this.isTransitioning) return;

        for (const area of this.triggerAreas) {
            if (
                playerX >= area.x &&
                playerX < area.x + area.width &&
                playerY >= area.y &&
                playerY < area.y + area.height
            ) {
                this.startTransition(area.targetMap);
                break;
            }
        }
    }

    /**
     * Inicia uma transição para outro mapa
     * @param {string} targetMap - Nome do mapa de destino
     */
    startTransition(targetMap) {
        this.isTransitioning = true;
        this.transitionAlpha = 0;
        this.transitionPhase = "out"; // Fase de escurecimento
        this.targetMap = targetMap;

        // Callback para carregar novo mapa quando a tela estiver totalmente escura
        this.transitionCallback = () => {
            this.gameEngine.loadMap(this.targetMap);
            this.transitionPhase = "in"; // Muda para fase de clareamento
        };
    }

    /**
     * Atualiza o estado da transição
     */
    updateTransition() {
        if (!this.isTransitioning) return;

        if (this.transitionPhase === "out") {
            // Aumenta opacidade (escurece a tela)
            this.transitionAlpha += this.transitionSpeed;
            if (this.transitionAlpha >= 1) {
                this.transitionAlpha = 1;
                if (this.transitionCallback) {
                    this.transitionCallback();
                    this.transitionCallback = null;
                }
            }
        } else if (this.transitionPhase === "in") {
            // Diminui opacidade (clareia a tela)
            this.transitionAlpha -= this.transitionSpeed;
            if (this.transitionAlpha <= 0) {
                this.transitionAlpha = 0;
                this.isTransitioning = false;
                this.transitionPhase = null;
            }
        }
    }

    /**
     * Renderiza o efeito de transição
     */
    renderTransition() {
        if (!this.isTransitioning) return;

        // Desenha retângulo preto com opacidade variável
        this.ctx.fillStyle = `rgba(0, 0, 0, ${this.transitionAlpha})`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default SceneManager;