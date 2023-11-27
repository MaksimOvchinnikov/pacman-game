
import {GameManager} from "./managers/GameManager.js";
import {lvls} from "./lvls.js";

const mapCanvas = document.getElementById("mapCanvas");
const staticObjCanvas = document.getElementById("staticObjCanvas");
const dynamicObjCanvas = document.getElementById("dynamicObjCanvas")
const mapContext = mapCanvas.getContext('2d');
const staticObjContext = staticObjCanvas.getContext('2d');
const dynamicObjContext = dynamicObjCanvas.getContext('2d');

let levels = JSON.parse(JSON.stringify(lvls));
let firstLvl = levels[0];
let gameManager;

let startLvl = async function (ghostParams, lvl) {
    const currLvl = levels.shift();
    levels.push(currLvl);
    document.getElementById("lvl").textContent = lvl;
    document.getElementById("loseAndWin").style.display = "none";
    gameManager = new GameManager(mapContext, dynamicObjContext, staticObjContext, ghostParams, lvl);
    await gameManager.init("/map/map.json");
    gameManager.startGame();

    document.getElementById("life").textContent = gameManager.pacman.life;

    document.addEventListener('addScore', () => {
        document.getElementById("score").textContent = gameManager.score;
    })
}

startLvl(levels[0].ghostParams, levels[0].lvl).then(() => {})


document.addEventListener('die', () => {
    console.log("dieEvent");
    setTimeout(() => {
        document.getElementById("life").textContent = gameManager.pacman.life;

        gameManager.pacman.clear(dynamicObjContext);

        for (let key in gameManager.ghosts) {
            if (gameManager.ghosts[key].isActive) {
                gameManager.ghosts[key].clear(dynamicObjContext);
                gameManager.ghosts[key].setDefaultPos();
                gameManager.ghosts[key].stepsToCell = 0;
            }
        }
        gameManager.pacman.setDefaultPos();
        gameManager.pacman.direction = "left";
        gameManager.pacman.draw(dynamicObjContext, "left", 2);
        gameManager.startGame();
    }, 2000);
});



document.addEventListener('gameOver', () => {
    setTimeout( () => {
        updateLeaderBoard(gameManager.score);
        document.getElementById("loseAndWin").style.display = "block";
        document.getElementById("context").textContent = "Вы проиграли!"
    }, 2000)
})

document.addEventListener('gameWin', () => {
    setTimeout( () => {
        updateLeaderBoard(gameManager.score);
        document.getElementById("loseAndWin").style.display = "block";
        document.getElementById("context").textContent = "Вы победили!"
    }, 2000)
})



document.getElementById("start").addEventListener("click",async (event) => {
    event.preventDefault();
    levels = JSON.parse(JSON.stringify(lvls));
    startLvl(levels[0].ghostParams, levels[0].lvl).then(() =>{});
})




document.addEventListener('win', () => {
    if(levels[0] !== firstLvl) {
        let score;
        let life;
        setTimeout(() => {
            score = gameManager.score;
            life = gameManager.pacman.life;
            document.getElementById("nextLevel").style.display = "block";
        }, 1000);

        setTimeout(() => {
            document.getElementById("nextLevel").style.display = "none";
            startLvl(levels[0].ghostParams, levels[0].lvl).then(() => {
                gameManager.pacman.life = life;
                gameManager.score = score;
                document.getElementById("life").textContent = gameManager.pacman.life;
            });
        }, 5000);
    } else {
        let gameWin = new Event("gameWin");
        document.dispatchEvent(gameWin);
    }

})


document.getElementById("leaderboard").addEventListener("click", event => {
    event.preventDefault();
    showLeaderBoard();
})

document.getElementById("closeLeaderboardModal").addEventListener("click", () => {
    document.getElementById("leaderboardModal").style.display = "none";
})

const updateLeaderBoard = function (score) {
    const playerNickname = localStorage.getItem("pacman.nickname");

    let leaderboard = JSON.parse(localStorage.getItem("pacman.leaderboard")) || [];

    const isPlayerInTable = leaderboard.findIndex(playerData => playerData.nickname === playerNickname);

    if (isPlayerInTable === -1) {
        leaderboard.push({
            nickname: playerNickname,
            score: score
        });
    } else if (score >= leaderboard[isPlayerInTable].score){
        leaderboard[isPlayerInTable].score = score;
    }

    leaderboard.sort( (a,b) => b.score - a.score);

    if (leaderboard.length > 10) {
        leaderboard.pop();
    }

    localStorage.setItem("pacman.leaderboard", JSON.stringify(leaderboard));
}

const showLeaderBoard = function () {

    const leaderboardDataJSON = localStorage.getItem("pacman.leaderboard");
    console.log(leaderboardDataJSON);
    if (leaderboardDataJSON) {
        const leaderboardData = JSON.parse(leaderboardDataJSON);
        console.log(leaderboardData)
        const table = document.getElementById("leaderboardTable");
        table.innerHTML = "";

        const header = table.insertRow(0);
        header.insertCell(0).textContent = "Игрок";
        header.insertCell(1).textContent = "Количество очков";

        leaderboardData.forEach((playerData, index) => {
            const row = table.insertRow(index + 1);
            row.insertCell(0).innerText = playerData.nickname;
            row.insertCell(1).innerText = playerData.score;
        });
    }
    document.getElementById("leaderboardModal").style.display = "block";
}