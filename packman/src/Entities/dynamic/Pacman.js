import {Entity} from "../Entity.js";

export class Pacman extends Entity {
    constructor(name, spriteManager, physicManager) {
        super(name, spriteManager);
        this.direction = "left";
        this.newDirection = this.direction;
        this.currentFrame = 0;
        this.totalFrames = 3;
        this.increase = true;
        this.physicManager = physicManager;
        this.step = 8;
        this.life = 3;
    }

    update(ctx) {

        this.direction = this.physicManager.checkCollision(this, this.direction, this.newDirection);

        if (this.direction === "stop") {
            return;
        }

        this.clear(ctx);


        if(this.direction === "left") {
            this.xPos -= this.step;
        } else if (this.direction === "right") {
            this.xPos += this.step;
        } else if (this.direction === "up") {
            this.yPos -= this.step;
        } else if (this.direction === "down") {
            this.yPos += this.step;
        }

        this.draw(ctx, this.direction, this.currentFrame);
        this.setNextFrame();
    }

    setNextFrame() {
        if (this.increase) {
            this.currentFrame = this.currentFrame + 1;

            if (this.currentFrame === this.totalFrames - 1) {
                this.increase = false;
            }

        } else {
            this.currentFrame -= 1;

            if(this.currentFrame === 0) {
                this.increase = true;
            }
        }
    }

    isGameOver(entity) {
        let overlapX = (this.xPos < entity.xPos + entity.xSize) && (this.xPos + this.xSize > entity.xPos);
        let overlapY =  (this.yPos < entity.yPos + entity.ySize) && (this.yPos + this.ySize > entity.yPos);

        return overlapX && overlapY;
    }

    setDefaultPos() {
        this.xPos = 416;
        this.yPos = 704;
    }


}