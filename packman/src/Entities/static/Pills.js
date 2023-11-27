import {Bonuses} from "./Bonuses.js";


export class Pills extends Bonuses{
    constructor(name, spriteManager, score) {
        super( name, spriteManager, score);
    }

    isWin() {
        return this.bonuses.length === 0;

    }
}