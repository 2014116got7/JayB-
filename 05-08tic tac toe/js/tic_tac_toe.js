"use strict";

let flag = "pen-flag"; 
let counter = 9; 

const squares = document.getElementsByClassName("square");
const squareArray = Array.from(squares);

const a_1 = document.getElementById("a_1");
const a_2 = document.getElementById("a_2");
const a_3 = document.getElementById("a_3");
const b_1 = document.getElementById("b_1");
const b_2 = document.getElementById("b_2");
const b_3 = document.getElementById("b_3");
const c_1 = document.getElementById("c_1");
const c_2 = document.getElementById("c_2");
const c_3 = document.getElementById("c_3");

const newgamebtn_display = document.getElementById("newgame-btn");
const newgamebtn = document.getElementById("btn90");

const lineArray = [
    JudgeLine(squareArray, ["a_1", "a_2", "a_3"]),
    JudgeLine(squareArray, ["b_1", "b_2", "b_3"]),
    JudgeLine(squareArray, ["c_1", "c_2", "c_3"]),
    JudgeLine(squareArray, ["a_1", "b_1", "c_1"]),
    JudgeLine(squareArray, ["a_2", "b_2", "c_2"]),
    JudgeLine(squareArray, ["a_3", "b_3", "c_3"]),
    JudgeLine(squareArray, ["a_1", "b_2", "c_3"]),
    JudgeLine(squareArray, ["a_3", "b_2", "c_1"])
];

let winningline = null;

const msgtxt1 = '<p class="image"><img src="img/penguins.jpg" width="61" height="61"></p><p class="text">Penguins Attack!(your turn)</p>';
const msgtxt2 = '<p class="image"><img src="img/whitebear.jpg" width="61" height="61"></p><p class="text">Whitebear Attack! (computer turn)</p>';
const msgtxt3 = '<p class="image"><img src="img/penguins.jpg" width="61" height="61"></p><p class="text animate__animated animate__lightSpeedInRight">Penguins Win!!</p>';
const msgtxt4 = '<p class="image"><img src="img/whitebear.jpg" width="61" height="61"></p><p class="text animate__animated animate__lightSpeedInLeft">WhiteBear Win!!</p>';
const msgtxt5 = '<p class="image"><img src="img/penguins.jpg" width="61" height="61"><img src="img/whitebear.jpg" width="61" height="61"></p><p class="text animate__bounceIn">Draw!!</p>';

let gameSound = ["sound/click_sound1.mp3", "sound/click_sound2.mp3", "sound/penwin_sound.mp3", "sound/bearwin_sound.mp3", "sound/draw_sound.mp3"];

function JudgeLine(targetArray, idArray) {
    return targetArray.filter(e => idArray.includes(e.id));
}

window.addEventListener("DOMContentLoaded", () => setMessage("pen-turn"), false);

[a_1, a_2, a_3, b_1, b_2, b_3, c_1, c_2, c_3].forEach(square => {
    square.addEventListener("click", () => isSelect(square));
});

function isSelect(selectSquare) {
    if (flag === "pen-flag") {
        playerMove(selectSquare);
        if (counter > 0 && flag === "bear-flag") computerMove();
    }
}

function playerMove(selectSquare) {
    if (selectSquare.classList.contains("js-unclickable")) return;

    let music = new Audio(gameSound[0]);
    music.currentTime = 0;
    music.play();

    selectSquare.classList.add("js-pen-checked", "js-unclickable");
    if (isWinner("penguins")) {
        setMessage("pen-win");
        gameOver("penguins");
        return;
    }
    setMessage("bear-turn");
    flag = "bear-flag";
    counter--;
    if (counter === 0) {
        setMessage("draw");
        gameOver("draw");
    }
}

function computerMove() {
    setTimeout(() => {
        let music = new Audio(gameSound[1]);
        music.currentTime = 0;
        music.play();

        // Simple AI: Select the first available square
        let emptySquares = squareArray.filter(square => !square.classList.contains("js-pen-checked") && !square.classList.contains("js-bear-checked"));
        if (emptySquares.length > 0) {
            let randomSquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];
            randomSquare.classList.add("js-bear-checked", "js-unclickable");
            if (isWinner("bear")) {
                setMessage("bear-win");
                gameOver("bear");
                return;
            }
            setMessage("pen-turn");
            flag = "pen-flag";
            counter--;
            if (counter === 0) {
                setMessage("draw");
                gameOver("draw");
            }
        }
    }, 1000); // Delay for better user experience
}

function isWinner(symbol) {
    const result = lineArray.some(line => {
        const subResult = line.every(square => {
            return symbol === "penguins"
                ? square.classList.contains("js-pen-checked")
                : square.classList.contains("js-bear-checked");
        });
        if (subResult) winningline = line;
        return subResult;
    });
    return result;
}

function setMessage(id) {
    const msgtext = {
        "pen-turn": msgtxt1,
        "bear-turn": msgtxt2,
        "pen-win": msgtxt3,
        "bear-win": msgtxt4,
        "draw": msgtxt5
    };
    document.getElementById("msgtext").innerHTML = msgtext[id] || msgtxt1;
}

function gameOver(status) {
    let w_sound;
    switch (status) {
        case "penguins":
            w_sound = gameSound[2];
            break;
        case "bear":
            w_sound = gameSound[3];
            break;
        case "draw":
            w_sound = gameSound[4];
            break;
    }

    let music = new Audio(w_sound);
    music.currentTime = 0;
    music.play();
    squareArray.forEach(square => square.classList.add("js-unclickable"));
    newgamebtn_display.classList.remove("js-hidden");

    if (status === "penguins" && winningline) {
        winningline.forEach(square => square.classList.add("js-pen_highLight"));
        $(document).snowfall({
            flakeColor: "rgb(255,240,245)",
            maxSpeed: 3,
            minSpeed: 1,
            maxSize: 20,
            minSize: 10,
            round: true
        });
    } else if (status === "bear" && winningline) {
        winningline.forEach(square => square.classList.add("js-bear_highLight"));
        $(document).snowfall({
            flakeColor: "rgb(175,238,238)",
            maxSpeed: 3,
            minSpeed: 1,
            maxSize: 20,
            minSize: 10,
            round: true
        });
    }
}

newgamebtn.addEventListener("click", () => {
    flag = "pen-flag";
    counter = 9;
    winningline = null;

    squareArray.forEach(square => {
        square.classList.remove(
            "js-pen-checked",
            "js-bear-checked",
            "js-unclickable",
            "js-pen_highLight",
            "js-bear_highLight"
        );
    });

    setMessage("pen-turn");
    newgamebtn_display.classList.add("js-hidden");
    $(document).snowfall("clear");
});
