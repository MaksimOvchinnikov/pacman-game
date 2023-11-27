
export class Cell {
    type = "";
    rowIdx = 0;
    colIdx = 0;
    gScore = 1000000000;
    hScore = 1000000000;
    fScore = 1000000000;
    neighbors = [];

    constructor(type, rowIdx, colIdx) {
        this.type = type;
        this.rowIdx = rowIdx;
        this.colIdx = colIdx;
    }


}