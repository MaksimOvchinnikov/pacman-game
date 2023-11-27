import {Entity} from "../Entity.js";
import {Cell} from "../../Alg/Cell.js";

export class Ghost extends Entity {
    oppositeDirection = {
        "left": "right",
        "right": "left",
        "up": "down",
        "down": "up"
    }

    runAwayTimer = 0;
    chaseTimer = 0;
    patrolTimer = 0;

    runAwayTimerConst = 0;
    chaseTimerConst = 0;
    patrolTimerConst = 0;


    isActive = false;
    mode = "";
    patrolCoords = [];
    steps = {}
    outConstant = 0;

    initLvlParams(ghostParams) {
        console.log(ghostParams);
        this.isActive = ghostParams.isActive;
        this.mode = ghostParams.mode;
        this.chaseTimerConst = ghostParams.chaseTimer;
        this.patrolTimerConst = ghostParams.patrolTimer;
        this.runAwayTimerConst = ghostParams.runAwayTimer;
        this.patrolCoords = ghostParams.patrolCoords;
        this.steps.chaseStep = ghostParams.steps.chaseStep;
        this.steps.runawayStep = ghostParams.steps.runawayStep;
        this.steps.patrolStep = ghostParams.steps.patrolStep;
        this.outConstant = ghostParams.outConstant;
        console.log(this.steps);

        if(this.mode === "chase") {
            this.chaseTimer = this.chaseTimerConst;
            this.patrolTimer = 0;
        } else if (this.mode === "patrol") {
            this.patrolTimer = this.patrolTimerConst;
            this.chaseTimer = 0;
        }
    }

    constructor(name, spriteManager, tileSize, aStar) {
        super(name, spriteManager);
        this.direction = "";
        this.tileSize = tileSize;
        this.fieldSize = {x: 26, y: 29};
        this.stepsToCell = 0;
        this.aStar = aStar;
        this.step = 4;
        this.goalCell = null;
        this.ghostCell = null;
    }

    async init(objectData, map, lvlParams) {
        await super.init(objectData)
        this.map = map;
        this.initLvlParams(lvlParams);
    }

    setStartAndEnd(goalCoords) {

        if (this.goalCell !== null) {
            this.map[this.goalCell.yIdx][this.goalCell.xIdx].type = "default";
        }

        if (this.ghostCell !== null) {
            this.map[this.ghostCell.yIdx][this.ghostCell.xIdx].type = "default";
        }

        let start  = {
            xIdx: this.xPos / this.tileSize.x,
            yIdx: this.yPos / this.tileSize.y
        }

        if (goalCoords.xPos + this.tileSize.x < 0) {
            goalCoords.xPos = this.map[0].length * this.tileSize.x - this.tileSize.x;
        } else if (goalCoords.xPos < 0) {
            goalCoords.xPos = 0;
        }
        else if (goalCoords.xPos > this.map[0].length * this.tileSize.x) {
            goalCoords.xPos = 0;
        }

        let end = {
            xIdx: Math.floor(goalCoords.xPos / this.tileSize.x),
            yIdx: Math.floor(goalCoords.yPos / this.tileSize.y)
        }


        //console.log(start);
        //console.log(end);
        this.map[start.yIdx][start.xIdx].type = "start";
        this.map[end.yIdx][end.xIdx].type = "end";
        this.goalCell = end;
        this.ghostCell = start;

    }

    setDirection() {
        //const copiedMap = this.map.map(row => row.map(obj => JSON.parse(JSON.stringify(obj))));
        //const copiedMap = this.map.map((row, rowIndex) => row.map((cell, colIndex) => cell.clone(rowIndex, colIndex)));

        this.aStar.init(this.deepCopyMap(this.map));
        let path = this.aStar.alg();

        if (path === null) {
            console.log("path null")
            this.stepsToCell = 0;
            this.direction = "stop";
            return;
        }

        let nextCell = path[path.length - 2];

        this.stepsToCell = this.tileSize.x / this.step;

        let newCoords = {
            x: nextCell.colIdx * this.tileSize.x,
            y: nextCell.rowIdx * this.tileSize.y
        }
        if (this.xPos === newCoords.x) {
            if (this.yPos < newCoords.y) {
                this.direction = "down"
            } else {
                this.direction = "up"
            }
        } else if (this.yPos === newCoords.y) {
            if (this.xPos < newCoords.x) {
                this.direction = "right";
            } else {
                this.direction = "left";
            }
        }
    }

    update(ctx, entityPosition) {

        if (!this.isActive) {
            return;
        }
        this.clear(ctx);

        if (this.mode === "chase") {

            this.chaseTimer -= 100;
            if (this.stepsToCell !== 0 && this.chaseTimer === 0) {
                this.chaseTimer += 100;
            }
            if (this.stepsToCell === 0) {
                this.chase(entityPosition);
            }


        } else if (this.mode === "runaway") {

            this.runAwayTimer -= 100;
            if (this.stepsToCell !== 0 && this.runAwayTimer === 0) {
                this.runAwayTimer += 100;
            }
            if (this.stepsToCell === 0) {
                this.runAway();
            }

        } else if (this.mode === "patrol") {

            this.patrolTimer -= 100;
            if (this.stepsToCell !== 0 && this.patrolTimer === 0) {
                this.patrolTimer += 100;
            }
            if (this.stepsToCell === 0) {
                this.patrol()
            }


        }


        if(this.direction === "left") {
            this.xPos -= this.step;
        } else if (this.direction === "right") {
            this.xPos += this.step;
        } else if (this.direction === "up") {
            this.yPos -= this.step;
        } else if (this.direction === "down") {
            this.yPos += this.step;
        } if (this)

        this.stepsToCell--;
        this.mode === "runaway" ? this.draw(ctx, "runaway", 0) : this.draw(ctx, "default", 0);

    }

    patrol() {
        this.step = this.steps.patrolStep;
        let currentCell = this.patrolCoords[0];
        if (currentCell.xPos === this.xPos && currentCell.yPos === this.yPos) {
            let cell = this.patrolCoords.shift();
            this.patrolCoords.push(cell);
        }
        currentCell = this.patrolCoords[0];

        this.setStartAndEnd(currentCell);
        this.setDirection();
    }

    chase(goalPostion) {
        this.step = this.steps.chaseStep;
        this.setStartAndEnd(goalPostion);
        this.setDirection();
    }

    runAway() {
        this.step = this.steps.runawayStep;
        let randomCell = this.generateRandomCell();
        this.setStartAndEnd(randomCell);
        this.setDirection();
    }


    generateRandomCell() {
        let randomX, randomY;
        //console.log(this.map);
        do {
            randomX = Math.floor(Math.random() * this.fieldSize.x);
            randomY = Math.floor(Math.random() * this.fieldSize.y);
            console.log("try", randomY, randomX);
        } while (
            this.map[randomY][randomX].type === "blocked" ||
            ((
                (randomX >= 9 && randomX <= 16)
            ) &&
            (
                (randomY >= 11 && randomY <= 15)
            )) ||
            (
                (randomX * this.tileSize.x === this.xPos) && (randomY * this.tileSize.y === this.yPos)
            )
        );
        console.log(randomX, randomY);

        return { xPos: randomX * this.tileSize.x, yPos: randomY * this.tileSize.y };
    }

    deepCopyMap(map) {
        return this.map.map(row => row.map(cell => new Cell(cell.type, cell.rowIdx, cell.colIdx)));
    }


    updateMode() {

        if (this.mode === "chase" && this.chaseTimer === 0) {
            if (this.patrolTimerConst === 0) {
                this.mode = "chase";
                this.chaseTimer = this.chaseTimerConst;
            } else {
                this.mode = "patrol"
                this.patrolTimer = this.patrolTimerConst;
            }
        } else if (this.mode === "patrol" && this.patrolTimer === 0) {
            this.mode = "chase";
            this.chaseTimer = this.chaseTimerConst;
        } else if (this.mode === "runaway" && this.runAwayTimer === 0) {
            if (this.chaseTimer > 0) {
                this.mode = "chase";
            } else if (this.patrolTimer > 0) {
                this.mode = "patrol";
            } else {
                this.mode = "chase";
                this.chaseTimer = this.chaseTimerConst;
            }
        }
    }

    setDefaultPos() {
        this.xPos = 384;
        this.yPos = 320;
    }



}
