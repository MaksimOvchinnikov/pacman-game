

export class EventManager {
    moveDirections = {
        left: "left",
        right: "right",
        down: "down",
        up: "up",
    }

    constructor(pacman) {
        this.pacman = pacman;
        document.addEventListener('keydown', this.pressHandler.bind(this));
    }

    pressHandler(event) {
        let newDirection = null;

        switch (event.key) {
            case 'ArrowUp':
                newDirection = this.moveDirections.up;
                break;
            case 'ArrowDown':
                newDirection = this.moveDirections.down;
                break;
            case 'ArrowLeft':
                newDirection = this.moveDirections.left;
                break;
            case 'ArrowRight':
                newDirection = this.moveDirections.right;
                break;
        }

        this.pacman.newDirection = newDirection;
    }




}