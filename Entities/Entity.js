export class Entity { // Exporta como uma classe ES6
    constructor() {
        this.sprite = {
            sourceX: 0,
            sourceY: 0,
            sourceWidth: 48,
            sourceHeight: 64
        };
        this.x = 0;
        this.y = 0;
        this.width = 64;
        this.height = 64;
    }

    update() {
        // Lógica de atualização genérica da entidade
    }
}