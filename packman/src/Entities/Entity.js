
export class Entity {
    constructor(name, spriteManager) {
        this.step = 4;
        this.xPos = 0;
        this.yPos = 0;
        this.xSize = 0;
        this.ySize = 0;
        this.name = name;
        this.spriteManager = spriteManager;
    }

    async init(objectData) {
        await this.loadEntityParams(objectData).then((res) => {
            this.xSize = res.xSize;
            this.ySize = res.ySize;
            this.xPos = res.xPos;
            this.yPos = res.yPos - this.ySize;
        }).catch(err => {
            console.error(err);
        })
    }

    async loadEntityParams(objectData) {
        return new Promise((resolve, reject) => {
            let entityData = {};
            for(let i = 0; i < objectData.length; i++) {
                let anotherTile = objectData[i];
                if (anotherTile.type === "objectgroup") {
                    for (let j = 0; j < anotherTile.objects.length; j++) {
                        let anotherObject = anotherTile.objects[j];
                        if (anotherObject.name === this.name) {
                            entityData = {
                                xSize: anotherObject.width,
                                ySize: anotherObject.height,
                                xPos: Math.floor(anotherObject.x),
                                yPos: Math.floor(anotherObject.y)
                            }
                            resolve(entityData);
                            break;
                        }
                    }
                }
            }
            reject(new Error("Error: Cant load entity params"))
        })
    }

    draw(ctx, direction, currentFrame) {
        this.spriteManager.drawSprite(ctx, this.name, this.name + "_" + direction, currentFrame, this.xPos, this.yPos);
    }

    clear(ctx) {
        this.spriteManager.removeSprite(ctx, this.xPos, this.yPos, this.xSize, this.ySize);
    }

}