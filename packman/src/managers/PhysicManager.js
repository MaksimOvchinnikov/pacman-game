
export class PhysicManager{

    constructor(mapManager) {
        this.mapManager = mapManager;
    }


    checkCollision(entity, prevDirection, direction) {
        let currentTile = this.mapManager.getTileByCoords(entity.xPos, entity.yPos);
        let nextTile = {};

        //console.log(entity.xPos, entity.yPos)

        if (entity.xPos === -1 * this.mapManager.tileSize.x) {
            entity.xPos = this.mapManager.tileSize.x + this.mapManager.mapSize.x;
        } else if (entity.xPos === this.mapManager.tileSize.x + this.mapManager.mapSize.x) {
            entity.xPos = -1 * this.mapManager.tileSize.x;
        }



        if (direction === "left") {

            if (currentTile.y === entity.yPos) {
                nextTile = this.mapManager.getTileByCoords(entity.xPos - entity.xSize, entity.yPos);

                if (currentTile.x === entity.xPos) {
                    if (this.mapManager.tilesetPassabillity[currentTile.id].includes("left") || this.mapManager.tilesetPassabillity[nextTile.id].includes("right")) {
                        return prevDirection === direction ? "stop" : prevDirection;
                    } else {
                        return direction;
                    }
                } else {
                    return direction;
                }

            }

        } else if (direction === "right") {

            if (currentTile.y === entity.yPos) {
                nextTile = this.mapManager.getTileByCoords(entity.xPos + entity.xSize, entity.yPos);

                if (currentTile.x === entity.xPos) {
                    if (this.mapManager.tilesetPassabillity[currentTile.id].includes("right") || this.mapManager.tilesetPassabillity[nextTile.id].includes("left")) {
                        return prevDirection === direction ? "stop" : prevDirection;
                    } else {
                        return direction;
                    }
                } else {
                    return direction;
                }
            }

        } else if (direction === "up") {

            if(entity.xPos < 0 || entity.xPos >= this.mapManager.mapSize.x) {

                return prevDirection;
            }


            if (currentTile.x === entity.xPos) {
                nextTile = this.mapManager.getTileByCoords(entity.xPos, entity.yPos - entity.ySize);

                if (currentTile.y === entity.yPos) {
                    if (this.mapManager.tilesetPassabillity[currentTile.id].includes("up") || this.mapManager.tilesetPassabillity[nextTile.id].includes("down")) {
                        return prevDirection === direction ? "stop" : prevDirection;
                    } else {
                        return direction;
                    }
                } else {
                    return direction;
                }
            }


        } else if (direction === "down") {

            if(entity.xPos < 0 || entity.xPos >= this.mapManager.mapSize.x) {
                return prevDirection;
            }

            if (currentTile.x === entity.xPos) {
                nextTile = this.mapManager.getTileByCoords(entity.xPos, entity.yPos + entity.ySize);

                if (currentTile.y === entity.yPos) {
                    if (this.mapManager.tilesetPassabillity[currentTile.id].includes("down") || this.mapManager.tilesetPassabillity[nextTile.id].includes("up")) {
                        return prevDirection === direction ? "stop" : prevDirection;
                    } else {
                        return direction;
                    }
                } else {
                    return direction;
                }
            }

        }

        return prevDirection;
    }



}