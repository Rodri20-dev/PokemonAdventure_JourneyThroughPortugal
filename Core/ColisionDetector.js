const collisionTiles = {};
let mapData; // Adicionamos para receber os dados do mapa

export default class CollisionDetector {
    constructor(data) {
        mapData = data;
        this.collisionTiles = {};
        this.initCollisionTiles();
    }

    initCollisionTiles() {
        const tileset = mapData.tilesets[0];
        tileset.tiles.forEach(tile => {
            if (tile.properties) {
                const collideProp = tile.properties.find(p => p.name === 'collide' && p.value);
                if (collideProp) {
                    this.collisionTiles[tile.id + tileset.firstgid] = true;
                }
            }
        });
    }

    isColliding(x, y) {
        const tileX = Math.floor(x / mapData.tilewidth);
        const tileY = Math.floor(y / mapData.tileheight);

        if (tileX < 0 || tileX >= mapData.width || tileY < 0 || tileY >= mapData.height) {
            return true;
        }

        const index = tileY * mapData.width + tileX;
        const tileId = mapData.layers[0].data[index];
        return this.collisionTiles[tileId];
    }
}