/**
 * Classe responsável por detectar colisões no mapa baseado nos dados do tileset e camadas.
 */
class CollisionDetector {
    /**
     * Inicializa o detector de colisão com os dados do mapa.
     * @param {Object} data - Dados do mapa no formato JSON (geralmente exportado do Tiled).
     */
    constructor(data) {
        // Armazena os dados do mapa
        this.mapData = data;
        // Objeto para mapear quais tiles possuem colisão (chave: tileId, valor: true)
        this.collisionTiles = {};
        // Inicializa o mapa de tiles de colisão
        this.initCollisionTiles();
    }

    /**
     * Inicializa os tiles que possuem a propriedade 'collide' definida como true,
     * adicionando-os ao objeto collisionTiles para facilitar a verificação de colisão.
     */
    initCollisionTiles() {
        const tileset = this.mapData.tilesets[0];
        
        // Percorre todos os tiles do tileset
        tileset.tiles.forEach(tile => {
            if (tile.properties) {
                // Procura a propriedade 'collide' com valor true
                const collideProp = tile.properties.find(p => p.name === 'collide' && p.value);
                if (collideProp) {
                    // Marca esse tile como colidível, ajustando o ID com firstgid
                    this.collisionTiles[tile.id + tileset.firstgid] = true;
                }
            }
        });
    }

    /**
     * Verifica se há colisão em uma determinada posição (x, y) e altura do objeto.
     * A verificação é feita nos quatro cantos da bounding box aproximada do jogador.
     * 
     * @param {number} x - Posição horizontal do objeto (em pixels).
     * @param {number} y - Posição vertical do objeto (em pixels).
     * @param {number} height - Altura do objeto (em pixels).
     * @returns {boolean} Retorna true se algum dos cantos está colidindo com tile colidível, senão false.
     */
    isColliding(x, y, height) {
        const tileWidth = this.mapData.tilewidth;
        const tileHeight = this.mapData.tileheight;

        // Busca a camada de colisão pelo nome 'collision' ou qualquer camada do tipo 'tilelayer'
        const layer = this.mapData.layers.find(l => l.name === 'collision' || l.type === 'tilelayer');
        if (!layer) return false;

        // Define os 4 pontos a serem verificados — cantos aproximados da bounding box
        const pointsToCheck = [
            { px: x - 4, py: y }, // canto superior esquerdo
            { px: x + 4, py: y }, // canto superior direito
            { px: x - 4, py: y + height - 16 }, // canto inferior esquerdo
            { px: x + 4, py: y + height - 16 } // canto inferior direito
        ];

        // Para cada ponto, calcula a coluna e linha do tile correspondente e verifica colisão
        for (const point of pointsToCheck) {
            const col = Math.floor(point.px / tileWidth);
            const row = Math.floor(point.py / tileHeight);
            const index = row * layer.width + col;

            // Obtém o tileId no layer
            const tileId = layer.data[index];
            // Verifica se esse tile está marcado como colidível
            if (this.collisionTiles[tileId]) {
                return true; // Colisão detectada
            }
        }

        return false; // Nenhuma colisão detectada
    }
}

export default CollisionDetector;
