import {Cell} from "../Alg/Cell.js";

export class MapManager {
    tileLayer = null // ссылка на блоки карты
    xCount = 0;
    yCount = 0;
    tileSize = {};
    mapSize = {};
    tileset = {};
    tilesetPassabillity = {
        1: ["left", "right", "up"],
        2: ["left", "up", "down"],
        3: ["up", "down"],
        4: ["right", "up", "down"],
        5: ["up", "down"],
        12: ["left", "right"],
        13: ["left", "up"],
        14: ["right", "up"],
        15: ["left"],
        16: ["up"],
        23: ["left", "down", "right"],
        24: ["left", "down"],
        25: ["right", "down"],
        26: ["down"],
        27: ["right"],
        34: [],
        35: []
    }

    constructor(mapContext, staticObjContext, dynamicObjContext) {
        this.backContext = mapContext;
        this.staticObjContext = staticObjContext;
        this.dynamicObjContext = dynamicObjContext;
    }


    async init(mapData) {

        await this.loadMapParams(mapData).then((res) => {
            this.xCount = res.xCount;
            this.yCount = res.yCount;
            this.tileSize.x = res.tileSize.x;
            this.tileSize.y = res.tileSize.y;
            this.mapSize.x = this.xCount * this.tileSize.x;
            this.mapSize.y = this.yCount * this.tileSize.y;
        }).catch(err => {
            console.error(err);
        });

        await this.loadTileLayer(mapData).then((res) => {
            this.tileLayer = res;
        }).catch(err => {
            console.error(err);
        });

        await this.loadTileset(mapData).then((res) => {
            this.tileset = res;
        }).catch(err => {
            console.error(err);
        })

        console.log(this.tileset)

        this.setCanvasSize();
        this.draw();

        return this.mapSize;
    }

    setCanvasSize() {
        this.backContext.canvas.height = this.mapSize.y;
        this.backContext.canvas.width = this.mapSize.x;

        this.staticObjContext.canvas.height = this.mapSize.y;
        this.staticObjContext.canvas.width = this.mapSize.x;

        this.dynamicObjContext.canvas.height = this.mapSize.y;
        this.dynamicObjContext.canvas.width = this.mapSize.x;
    }


    async loadMapParams(mapData) {
        return new Promise((resolve, reject)=> {
            if (mapData.width !== undefined && mapData.height != undefined &&
                mapData.tilewidth !== undefined && mapData.tileheight !== undefined) {

                resolve({
                    xCount: mapData.width,
                    yCount: mapData.height,
                    tileSize: {
                        x : mapData.tilewidth,
                        y: mapData.tileheight
                    },
                });
            } else {
                reject(new Error('Error: Cant load map params'));
            }
        });
    }

    async loadTileLayer(mapData) {
        return new Promise((resolve, reject) => {
            let isTileLayerFounded = false;
            for (let i = 0; i < mapData.layers.length; i++) {
                let layer = mapData.layers[i];
                if (layer.type === "tilelayer") {
                    resolve(layer);
                    isTileLayerFounded = true;
                    break;
                }
            }
            if (!isTileLayerFounded) {
                reject(new Error('Error: Cant load tile layer'));
            }
        });
    }

    async loadTileset(mapData) {
        return new Promise((resolve, reject) => {
            let t = {};
            let isTilesetFounded = false;

            for (let i = 0; i < mapData.tilesets.length; i++) {
                t = mapData.tilesets[i];

                if (t.class === "background") {
                    isTilesetFounded = true;
                    let image = new Image();
                    image.onload = () => {
                        let ts = {
                            firstgid: t.firstgid,
                            image: image,
                            name: t.name,
                            xCount: Math.floor(t.imagewidth / this.tileSize.x),
                            yCount: Math.floor(t.imageheight / this.tileSize.y)
                        }
                        resolve(ts);
                    }
                    image.onerror = (error) => reject(new Error(`Error: Cant loading image: ${error}`));
                    image.src = t.image;
                    break;
                }
            }

            if (!isTilesetFounded) {
                reject(new Error('Error: cant find tileset packman'));
            }
        });
    }


    draw() {
        for (let i = 0; i < this.tileLayer.data.length; i++) {
            if (this.tileLayer.data[i] !== 0) {
                let tile = this.getTile(this.tileLayer.data[i]);

                let pX = (i % this.xCount) * this.tileSize.x;
                let pY = Math.floor(i / this.xCount) * this.tileSize.y;

                this.backContext.drawImage(tile.image, tile.px, tile.py, this.tileSize.x, this.tileSize.y, pX, pY, this.tileSize.x, this.tileSize.y);
            }
        }
    }

    getTile(tileIndex) {
        let tile = {
            image: null,
            px: 0,
            py: 0
        }

        tile.image = this.tileset.image;
        let id = tileIndex - this.tileset.firstgid;
        let x = id % this.tileset.xCount;
        let y = Math.floor(id / this.tileset.xCount);

        tile.px = x * this.tileSize.x;
        tile.py = y * this.tileSize.y;

        return tile;
    }

    getTileByCoords(x, y) {
        let tile = {
            x: 0,
            y: 0,
            id: 0,
        }
        let row = Math.floor(x / this.tileSize.x);
        let col = Math.floor(y / this.tileSize.y);

        tile.x = row * this.tileSize.x;
        tile.y = col * this.tileSize.y;
        tile.id = this.tileLayer.data[col * this.xCount + row];

        return tile;
    }

    getSubMap(ghostCoords, pacmanCoords) {

        let subMap = [];

        for (let i = 0; i < this.yCount ; i++) {
            subMap[i] = [];
            for (let j = 0; j < this.xCount; j++) {
                subMap[i][j] = this.tileLayer.data[i * this.xCount + j] === 34 ? new Cell("blocked",i,j) : new Cell("default", i, j);
            }
        }

        return subMap;

    }

}