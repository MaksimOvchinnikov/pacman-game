
export class SpriteManager {
    sprites = {};
    async init(sprites) {
        try {
            this.sprites = await this.loadSprites(sprites);
        } catch (err) {
            console.error(err);
        }
    }

    async loadSprites(sprites) {
        const spritesObjects = [];

        for (const anotherSprite of sprites) {
            if (anotherSprite.class === "entity") {
                const spriteObject = {
                    name: anotherSprite.name,
                    tileSize: {
                        x: anotherSprite.tilewidth,
                        y: anotherSprite.tileheight
                    },
                    frames: {}
                };

                await Promise.all(anotherSprite.tiles.map((frame) => {
                    return new Promise((resolveFrame, rejectFrame) => {
                        const image = new Image();
                        image.onload = () => {
                            if (!spriteObject.frames[frame.type]) {
                                spriteObject.frames[frame.type] = [];
                            }
                            spriteObject.frames[frame.type].push({
                                image: image,
                                name: frame.properties[0].value
                            });
                            resolveFrame(); // обещание загрузки отдельного фрейма
                        };
                        image.onerror = (error) => rejectFrame(new Error(`Ошибка: Не удается загрузить изображение: ${error}`));
                        image.src = frame.image;
                    });
                }));

                spritesObjects.push(spriteObject);
            }
        }

        return spritesObjects;
    }


    drawSprite(ctx, entityName, spriteName, currentFrame, xPos, yPos) {
        let entity = {};
        let frames = {};
        for (let i = 0; i < this.sprites.length; i++) {
            if (this.sprites[i].name === entityName) {
                entity = this.sprites[i];
                for(const direction in entity.frames) {
                    if (direction === spriteName) {
                        frames = entity.frames[direction];
                    }
                }
            }
        }

        ctx.drawImage(frames[currentFrame].image, 0, 0, entity.tileSize.x, entity.tileSize.y, xPos, yPos, entity.tileSize.x, entity.tileSize.y);
    }

    removeSprite(ctx, xPos, yPos, xSize, ySize) {
        ctx.clearRect(xPos, yPos, xSize, ySize);
    }


}