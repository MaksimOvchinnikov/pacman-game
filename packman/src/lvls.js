
export const lvl1 = {
    "redGhost": {
        isActive: true,
        mode: "chase",
        chaseTimer: 20000,
        patrolTimer: 20000,
        runAwayTimer: 10000,
        patrolCoords: [
            {
                xPos: 14 * 32,
                yPos: 4 * 32
            },
            {
                xPos: 25 * 32,
                yPos: 4 * 32
            },
            {
                xPos: 25 * 32,
                yPos: 0
            },
            {
                xPos: 14 * 32,
                yPos: 0
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 8
        },
        outConstant: 0
    },
    "blueGhost": {
        isActive: false,
        mode: "patrol",
        chaseTimer: 20000,
        patrolTimer: 10000,
        runAwayTimer: 10000,
        patrolCoords: [
            {
                xPos: 5 * 32,
                yPos: 22 * 32
            },
            {
                xPos: 0,
                yPos: 28 * 32
            },
            {
                xPos: 11 * 32,
                yPos: 25 * 32
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 8
        },
        outConstant: 0.85
    },
    "orangeGhost": {
        isActive: false,
        mode: "chase",
        chaseTimer: 10000,
        patrolTimer: 0,
        runAwayTimer: 10000,
        patrolCoords: [
            {
                xPos: 20 * 32,
                yPos: 22 * 32
            },
            {
                xPos: 14 * 32,
                yPos: 28 * 32
            },
            {
                xPos: 25 * 32,
                yPos: 25 * 32
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 8
        },
        outConstant: 0.4
    },
    "pinkGhost": {
        isActive: false,
        mode: "patrol",
        chaseTimer: 30000,
        patrolTimer: 10000,
        runAwayTimer: 10000,
        patrolCoords: [
            {
                xPos: 0,
                yPos: 4 * 32,
            },
            {
                xPos: 0,
                yPos: 0
            },
            {
                xPos: 11 * 32,
                yPos: 0,
            },
            {
                xPos: 11 * 32,
                yPos: 4 * 32
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 8
        },
        outConstant: 0.6
    }
}



export const lvl2 = {
    "redGhost": {
        isActive: true,
        mode: "patrol",
        chaseTimer: 20000,
        patrolTimer: 20000,
        runAwayTimer: 8000,
        patrolCoords: [
            {
                xPos: 14 * 32,
                yPos: 4 * 32
            },
            {
                xPos: 20 * 32,
                yPos: 4 * 32
            },
            {
                xPos: 20 * 32,
                yPos: 7 * 32
            },
            {
                xPos: 25 * 32,
                yPos: 7 * 32
            },
            {
                xPos: 25 * 32,
                yPos: 0
            },
            {
                xPos: 14 * 32,
                yPos: 0
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 16
        },
        outConstant: 1
    },
    "blueGhost": {
        isActive: false,
        mode: "patrol",
        chaseTimer: 20000,
        patrolTimer: 20000,
        runAwayTimer: 8000,
        patrolCoords: [
            {
                xPos: 11 * 32,
                yPos: 19 * 32
            },
            {
                xPos: 11 * 32,
                yPos: 28 * 32
            },
            {
                xPos: 0,
                yPos: 28 * 32
            },
            {
                xPos: 0,
                yPos: 19 * 32
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 16
        },
        outConstant: 0.95
    },
    "orangeGhost": {
        isActive: false,
        mode: "chase",
        chaseTimer: 10000,
        patrolTimer: 0,
        runAwayTimer: 10000,
        patrolCoords: [
            {
                xPos: 20 * 32,
                yPos: 22 * 32
            },
            {
                xPos: 14 * 32,
                yPos: 28 * 32
            },
            {
                xPos: 25 * 32,
                yPos: 25 * 32
            }
        ],
        steps : {
            chaseStep: 8,
            runawayStep: 4,
            patrolStep: 4,
        },
        outConstant: 0.6
    },
    "pinkGhost": {
        isActive: false,
        mode: "patrol",
        chaseTimer: 30000,
        patrolTimer: 10000,
        runAwayTimer: 10000,
        patrolCoords: [
            {
                xPos: 11 * 32,
                yPos: 4 * 32
            },
            {
                xPos: 11 * 32,
                yPos: 0,
            },
            {
                xPos: 0,
                yPos: 0
            },
            {
                xPos: 0,
                yPos: 7 * 32
            },
            {
                xPos: 5 * 32,
                yPos: 7 * 32
            }
        ],
        steps : {
            chaseStep: 4,
            runawayStep: 4,
            patrolStep: 16
        },
        outConstant: 0.75
    }
}



export const lvls = [
    {
        lvl: 1,
        ghostParams: lvl1
    },
    {
        lvl: 2,
        ghostParams: lvl2
    }
];