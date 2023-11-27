
export class Bonuses {
    constructor(name, spriteManager, score) {
        this.name = name;
        this.spriteManager = spriteManager;
        this.bonuses = [];
        this.score = score;
    }

    async init(objectData) {
        await this.loadBonuses(objectData).then((res) => {
            this.bonuses = res;
            this.totalPills = this.bonuses.length;
        }).catch(err => {
            console.error(err);
        })
    }

    async loadBonuses(objectData) {
        return new Promise((resolve, reject) => {
            let bonuses = [];

            for(let i = 0; i < objectData.length; i++) {
                let anotherBonus = objectData[i];

                if (anotherBonus.type === "objectgroup") {
                    for (let j = 0; j < anotherBonus.objects.length; j++) {
                        let anotherObject = anotherBonus.objects[j];
                        if (anotherObject.name === this.name) {
                            let bonus = {
                                xSize: anotherObject.width,
                                ySize: anotherObject.height,
                                xPos: Math.floor(anotherObject.x),
                                yPos: Math.floor(anotherObject.y - anotherObject.height)
                            }

                            bonuses.push(bonus);
                        }
                    }
                    resolve(bonuses);
                    break;
                }
            }
            reject(new Error("Error: Cant load bonuses"));
        })
    }

    draw(ctx) {
        for (let i = 0; i < this.bonuses.length; i++) {
            this.spriteManager.drawSprite(ctx, this.name, this.name, 0, this.bonuses[i].xPos, this.bonuses[i].yPos);
        }
    }

    clear(ctx, bonus) {
        this.spriteManager.removeSprite(ctx, bonus.xPos, bonus.yPos, bonus.xSize, bonus.ySize);
    }

    update(ctx, xEntity, yEntity, xSizeEntity, ySizeEntity) {
        for(let i = 0; i < this.bonuses.length; i++) {
            let center = {
                x: this.bonuses[i].xPos + this.bonuses[i].xSize / 2,
                y: this.bonuses[i].yPos + this.bonuses[i].ySize / 2,
            }
            if (this.isAnyBonusCollected(center, xEntity, yEntity, xSizeEntity, ySizeEntity)) {
                this.clear(ctx, this.bonuses[i]);
                this.bonuses.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    isAnyBonusCollected(centerOfBonus, xEntity, yEntity, xSizeEntity, ySizeEntity) {
        return (xEntity <= centerOfBonus.x && centerOfBonus.x <= xEntity + xSizeEntity) &&
            (yEntity <= centerOfBonus.y && centerOfBonus.y <= yEntity + ySizeEntity);
    }


}