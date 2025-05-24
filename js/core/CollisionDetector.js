//CollisionDetector.js
class CollisionDetector {
    constructor(data) {
        this.mapData = data;
        this.collisionTiles = {};
        this.initCollisionTiles();
    }

    initCollisionTiles() {
        console.log(this.mapData);
        const tileset = this.mapData.tilesets[0];
        
        tileset.tiles.forEach(tile => {
            if (tile.properties) {
                const collideProp = tile.properties.find(p => p.name === 'collide' && p.value);
                if (collideProp) {
                    this.collisionTiles[tile.id + tileset.firstgid] = true;
                }
            }
        });
    }

    isColliding(x, y, height) {
        const tileWidth = this.mapData.tilewidth;
        const tileHeight = this.mapData.tileheight;

        const layer = this.mapData.layers.find(l => l.name === 'collision' || l.type === 'tilelayer');
        if (!layer) return false;

        // Verifica os 4 cantos da bounding box do jogador
        const pointsToCheck = [
            { px: x - 4, py: y }, // canto superior esquerdo
            { px: x + 4, py: y }, // canto superior direito
            { px: x - 4, py: y + height - 16 }, // canto inferior esquerdo
            { px: x + 4, py: y + height - 16 } // canto inferior direito
        ];

        for (const point of pointsToCheck) {
            const col = Math.floor(point.px / tileWidth);
            const row = Math.floor(point.py / tileHeight);
            const index = row * layer.width + col;

            const tileId = layer.data[index];
            if (this.collisionTiles[tileId]) {
                return true;
            }
        }

        return false;
    }

}

export default CollisionDetector