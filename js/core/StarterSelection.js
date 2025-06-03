import Pokemon from "../entities/Pokemon.js";

/**
 * Classe responsável pela tela de seleção de Pokémon inicial.
 */
class StarterSelection {
    /**
     * @param {HTMLCanvasElement} canvas - Elemento canvas do jogo.
     * @param {Array} starters - Lista de Pokémon iniciais disponíveis.
     * @param {Player} player - Instância do jogador.
     */
    constructor(canvas, starters, player) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.starters = starters; // Lista de Pokémon iniciais
        this.player = player; // Referência ao jogador
        
        // Configura imagem de fundo
        this.backgroundImage = new Image();
        this.backgroundImage.src = 'assets/images/background/starter.jpg';
        
        // Estado da seleção
        this.selectedIndex = 0; // Índice do Pokémon selecionado
        this.isSelecting = true; // Flag indicando se está em seleção

        // Pré-carrega imagens dos Pokémon
        this.images = [];
        this.starters.forEach((starter, index) => {
            if (starter.imgFront) {
                const img = new Image();
                img.src = starter.imgFront;
                this.images[index] = img;
            } else {
                this.images[index] = null;
            }
        });

        // Configura listener de teclado
        this.handleKeyDown = this.handleKeyDown.bind(this);
        window.addEventListener('keydown', this.handleKeyDown);
    }

    /**
     * Manipula entrada do teclado durante a seleção.
     * @param {KeyboardEvent} e - Evento de tecla pressionada.
     */
    handleKeyDown(e) {
        if (e.key === 'ArrowLeft') {
            // Seleciona Pokémon à esquerda
            this.selectedIndex = (this.selectedIndex - 1 + this.starters.length) % this.starters.length;
        } else if (e.key === 'ArrowRight') {
            // Seleciona Pokémon à direita
            this.selectedIndex = (this.selectedIndex + 1) % this.starters.length;
        } else if (e.key === 'Enter') {
            // Confirma seleção
            this.chooseStarter();
        }
    }

    /**
     * Finaliza a seleção e adiciona o Pokémon escolhido ao jogador.
     */
    chooseStarter() {
        // Remove listener de teclado
        window.removeEventListener('keydown', this.handleKeyDown);
        
        // Obtém Pokémon selecionado
        let pokemon = this.starters[this.selectedIndex];
        
        // Adiciona Pokémon à equipe do jogador
        this.player.pokemons.push(
            new Pokemon(pokemon.name, pokemon.hp, pokemon.attack, pokemon.imgFront, pokemon.imgBack)
        );
        
        // Finaliza seleção
        this.isSelecting = false;
    }

    /**
     * Renderiza a tela de seleção.
     */
    render() {
        const ctx = this.ctx;

        // Desenha fundo (com overlay escuro)
        if (this.backgroundImage.complete) {
            ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
            ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
            ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }

        // Configurações de texto
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Título
        ctx.font = "bold 12px Arial";
        ctx.fillText("Escolha seu pokémon inicial!", this.canvas.width / 2, this.canvas.height * 0.15);

        // Calcula posicionamento dos Pokémon
        const spacing = 85; // Espaço entre Pokémon
        const totalWidth = (this.starters.length - 1) * spacing;
        const centerX = this.canvas.width / 2;
        const baseY = this.canvas.height / 2;

        // Desenha cada Pokémon disponível
        this.starters.forEach((starter, index) => {
            const x = centerX - totalWidth / 2 + index * spacing;
            const y = baseY;

            // Caixa de seleção (vermelha para selecionado, branca para outros)
            ctx.fillStyle = (index === this.selectedIndex) ? "#CC0000" : "white";
            ctx.fillRect(x - 45, y - 45, 90, 90);

            // Nome do Pokémon
            ctx.fillStyle = "white";
            ctx.font = "bold 12px Arial";
            ctx.fillText(starter.name, x, this.canvas.height * 0.85);

            // Sprite do Pokémon (se carregado)
            const img = this.images[index];
            if (img && img.complete) {
                ctx.drawImage(img, x - 32, y - 32, 64, 64);
            }
        });

        // Instruções
        ctx.font = "bold 9px Arial";
        ctx.fillText(
            "Use as setas para selecionar, ENTER para confirmar", 
            this.canvas.width / 2, 
            this.canvas.height * 0.95
        );
    }

    /**
     * Verifica se a seleção está ativa.
     * @returns {boolean} True se em seleção, False caso contrário.
     */
    isSelectingStarter() {
        return this.isSelecting;
    }
}

export default StarterSelection;