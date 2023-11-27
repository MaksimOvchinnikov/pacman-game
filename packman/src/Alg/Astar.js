import {Cell} from "./Cell.js";

export class Astar {

    constructor() {
        this.field = null;
        this.startCell = null;
        this.endCell = null;
    }

    init(field) {
        this.field = field;
        //console.log(this.field);
        this.closeSet = [];
        this.openSet = [];
        this.cameFrom = new Map();
        this.setStartEndCells();
        this.setNeighbors();
        this.startCell.gScore = 0;
        this.startCell.hScore = this.calcHeuristic(this.startCell, this.endCell);
        this.startCell.fScore = this.startCell.gScore + this.startCell.hScore;
        this.openSet.push(this.startCell);
    }

    setStartEndCells () {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                if (this.field[i][j].type === "start") {
                    this.startCell = this.field[i][j];
                } else if (this.field[i][j].type === "end") {
                    this.endCell = this.field[i][j];
                }
            }
        }
    }

    setNeighbors() {
        for (let i = 0; i < this.field.length; i++) {
            for (let j = 0; j < this.field[0].length; j++) {
                this.field[i][j].neighbors = this.getNeighbors(i, j);
            }
        }
    }

    getNeighbors(row, col) {
        const neighbors = [];
        const directions = [
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 }
        ];

        for (let direction of directions) {
            let numCol = col + direction.dx;
            let numRow = row + direction.dy;

            if (
                numCol >= 0 &&
                numCol < this.field[0].length &&
                numRow >= 0 &&
                numRow < this.field.length &&
                !this.field[numRow][numCol].isBlocked
            ) {
                neighbors.push(this.field[numRow][numCol]);
            }
        }

        return neighbors;
    }


    calcHeuristic(startCell, endCell) {
        return Math.abs(startCell.rowIdx - endCell.rowIdx) + Math.abs(startCell.colIdx - endCell.colIdx);
    }

    alg() {
        while(this.openSet.length > 0) {

            let current = this.openSet[0];
            for(let i = 1; i < this.openSet.length; i++) {
                if (this.openSet[i].fScore < current.fScore) {
                    current = this.openSet[i];
                }
            }

            this.openSet = this.openSet.filter((cell) => cell !== current);
            this.closeSet.push(current);

            if (current === this.endCell) {
                return this.reconstructPath(current);
            }


            for (let neighbor of current.neighbors) {
                if (neighbor.type !== "blocked") {
                    if (this.closeSet.includes(neighbor)) {
                        continue;
                    }

                    let tentativeGScore = current.gScore + 1;

                    if (tentativeGScore < neighbor.gScore) {
                        this.cameFrom.set(neighbor, current);
                        neighbor.gScore = tentativeGScore;
                        neighbor.hScore = this.calcHeuristic(neighbor, this.endCell);
                        neighbor.fScore = neighbor.gScore + neighbor.hScore;
                        this.openSet.push(neighbor);
                    }
                }
            }
        }

        return null;
    }

    reconstructPath(cell) {
        const path = [];
        let current = cell;
        path.push(current);
        while (current.type !== "start") {
            current = this.cameFrom.get(current);
            path.push(current);
        }
        return path;

    }

}