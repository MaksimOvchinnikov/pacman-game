import {Astar} from "../Alg/Astar.js";
import {Ghost} from "../Entities/dynamic/Ghost.js";
import {MapManager} from "./MapManager.js";
import {SpriteManager} from "./SpriteManager.js";
import {Pacman} from "../Entities/dynamic/Pacman.js";
import {PhysicManager} from "./PhysicManager.js";
import {EventManager} from "./EventManager.js";
import {Pills} from "../Entities/static/Pills.js";
import {BigPills} from "../Entities/static/BigPills.js";
import {SoundManager} from "./SoundManager.js";

export class GameManager {
    constructor(mapContext, dynamicObjContext, staticObjContext, ghostParams, lvl) {
        this.mapContext = mapContext;
        this.dynamicObjContext = dynamicObjContext;
        this.staticObjContext = staticObjContext;
        this.mapManager = new MapManager(this.mapContext, this.staticObjContext, this.dynamicObjContext);
        this.spriteManager = new SpriteManager();
        this.physicManager = new PhysicManager(this.mapManager);
        this.pacman = new Pacman("pacman", this.spriteManager, this.physicManager);
        this.eventManager = new EventManager(this.pacman);
        this.pills = new Pills("pill", this.spriteManager, 20);
        this.bigPills = new BigPills("big_pill", this.spriteManager, 50);
        this.score = 0;
        this.aStar = new Astar();
        let fieldSize =
            {
            x: this.mapManager.xCount,
            y: this.mapManager.yCount
        }
        this.ghostParams = ghostParams;
        this.ghosts = {
            blueGhost: new Ghost("ghost_blue", this.spriteManager, this.mapManager.tileSize, this.aStar),
            redGhost: new Ghost("ghost_red", this.spriteManager, this.mapManager.tileSize, this.aStar),
            pinkGhost: new Ghost("ghost_pink", this.spriteManager, this.mapManager.tileSize, this.aStar),
            orangeGhost: new Ghost("ghost_orange", this.spriteManager, this.mapManager.tileSize, this.aStar),
        }
        this.lvl = lvl;
        this.soundManager = new SoundManager();
    }

    async init(mapPath) {
        await this.loadData(mapPath).then(async (res) => {

            await this.mapManager.init(res);

            await this.spriteManager.init(res.tilesets);

            await this.pacman.init(res.layers).then( () => {
                this.pacman.draw(this.dynamicObjContext, "left", 2);
            });

            await this.pills.init(res.layers).then(() => {
                this.pills.draw(this.staticObjContext);
            })

            await this.bigPills.init(res.layers).then(() => {
                this.bigPills.draw(this.staticObjContext);
            })



            let initPromises = [];

            for (let key in this.ghosts) {
                if (this.ghosts.hasOwnProperty(key)) {
                    initPromises.push(this.ghosts[key].init(res.layers, this.mapManager.getSubMap(), this.ghostParams[key]));
                }
            }

            Promise.all(initPromises)
                .then(() => {
                    console.log("All ghosts initialized successfully.");

                    for (let key in this.ghosts) {
                        if (this.ghosts.hasOwnProperty(key)) {
                            this.ghosts[key].draw(this.dynamicObjContext, "default", 0);
                        }
                    }
                })

            await this.soundManager.init()
            const soundFiles = ['/sounds/bonus.mp3', '/sounds/killGhost.mp3', '/sounds/lose.mp3'];
            await this.soundManager.loadArray(soundFiles);


        }).catch(err => {
            console.error(err);
        })

    }

    async loadData(path) {
        return new Promise((resolve, reject) => {
            let request = new XMLHttpRequest();
            request.onreadystatechange = () => {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        resolve(JSON.parse(request.responseText));
                    } else {
                        reject(new Error(`Failed to load map. Status: ${request.status}`));
                    }
                }
            };
            request.open("GET", path, true);
            request.send();
        });
    }



    startGame() {
        console.log(this.soundManager.clips);
        this.gameInteraval = setInterval(() => {
            this.pacman.update(this.dynamicObjContext);

            if (this.pills.update(this.staticObjContext, this.pacman.xPos, this.pacman.yPos, this.pacman.xSize, this.pacman.ySize)){
                this.score += this.pills.score;
                this.soundManager.play('/sounds/bonus.mp3', {volume: 0.2, loop: false});
                let addScoreEvent = new Event("addScore");
                document.dispatchEvent(addScoreEvent);
                if (this.pills.isWin()) {
                    let winEvent = new Event("win");
                    document.dispatchEvent(winEvent);
                    console.log("win");
                    clearInterval(this.gameInteraval);
                }
            }

            if (this.bigPills.update(this.staticObjContext, this.pacman.xPos, this.pacman.yPos, this.pacman.xSize, this.pacman.ySize)) {
                this.soundManager.play('/sounds/bonus.mp3', {volume: 0.2, loop: false});
                for (let key in this.ghosts) {
                    if (this.ghosts[key].isActive) {
                        this.ghosts[key].mode = "runaway";
                        this.ghosts[key].runAwayTimer = this.ghosts[key].runAwayTimerConst;
                    }
                }
            } else {

                this.updateGhosts();

                for (let key in this.ghosts) {
                    if (this.pacman.isGameOver(this.ghosts[key])) {
                        if (this.ghosts[key].mode === "runaway") {
                            this.soundManager.play('/sounds/killGhost.mp3', {volume: 0.2,loop: false});
                            this.ghosts[key].clear(this.dynamicObjContext);
                            this.ghosts[key].setDefaultPos();
                            this.ghosts[key].stepsToCell = 0;
                        } else {
                            this.pacman.life--;
                            this.soundManager.play('/sounds/lose.mp3', {volume: 0.2, loop: false});
                            if (this.pacman.life === 0) {
                                let gameOverEvent = new Event("gameOver");
                                document.dispatchEvent(gameOverEvent);
                                clearInterval(this.gameInteraval);
                            } else {
                                let dieEvent = new Event("die");
                                document.dispatchEvent(dieEvent);
                                clearInterval(this.gameInteraval);
                            }
                        }
                    }
                }
            }

        }, 100)
    }



    updateGhosts (){
        let pacmanPos = {
            xPos: this.pacman.xPos,
            yPos: this.pacman.yPos
        }

        this.ghosts.redGhost.updateMode();
        this.ghosts.redGhost.update(this.dynamicObjContext, pacmanPos);

        if(Math.floor(this.pills.totalPills * this.ghosts.blueGhost.outConstant) > this.pills.bonuses.length && this.ghosts.blueGhost.isActive === false) {
            this.ghosts.blueGhost.isActive = true;
            this.ghosts.blueGhost.clear(this.dynamicObjContext);
            this.ghosts.blueGhost.setDefaultPos();
        }

        if (this.ghosts.blueGhost.isActive) {
            this.ghosts.blueGhost.updateMode();
            this.ghosts.blueGhost.update(this.dynamicObjContext, pacmanPos);
        }

        if (Math.floor(this.pills.totalPills * this.ghosts.pinkGhost.outConstant) > this.pills.bonuses.length && this.ghosts.pinkGhost.isActive === false) {
            this.ghosts.pinkGhost.isActive = true;
            this.ghosts.pinkGhost.clear(this.dynamicObjContext);
            this.ghosts.pinkGhost.setDefaultPos();
        }

        if (this.ghosts.pinkGhost.isActive) {
            this.ghosts.pinkGhost.updateMode();
            this.ghosts.pinkGhost.update(this.dynamicObjContext, pacmanPos);
        }

        if (Math.floor(this.pills.totalPills * this.ghosts.orangeGhost.outConstant) > this.pills.bonuses.length && this.ghosts.orangeGhost.isActive === false) {
            this.ghosts.orangeGhost.isActive = true;
            this.ghosts.orangeGhost.clear(this.dynamicObjContext);
            this.ghosts.orangeGhost.setDefaultPos();
        }

        if (this.ghosts.orangeGhost.isActive) {
            this.ghosts.orangeGhost.updateMode();
            this.ghosts.orangeGhost.update(this.dynamicObjContext, pacmanPos);
        }

    }

}