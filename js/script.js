const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const hideScore = document.querySelector(".score");
const finalScore = document.querySelector(".final-score > span");
const score = document.querySelector(".score--value");
const playerNameInput = document.querySelector(".player-name");
const playerNameDisplay = document.querySelector(".player-name-display");
const menuOver = document.querySelector(".menu-over");
const menuScreen = document.querySelector(".menu-screen");
const buttonStart = document.querySelector(".btn-start");
const buttonPlay = document.querySelector(".btn-play");
const buttonVersus = document.querySelector(".btn-versus");
const buttonOut = document.querySelector(".btn-out");

const eatSound = new Audio("sounds/eat.mp3");
const gameOverSound = new Audio("sounds/gameover.mp3");
const backSound = new Audio("sounds/back.mp3");

backSound.loop = true;
backSound.volume = 0.3;

const size = 30;
const initialPosition = {x: 270, y: 240};

let direction, loopId, chaosTimer = 0;
let snake = [{x: 270, y: 240}];
let computerSnake = [{ x: 30, y: 30 }];
let gameSpeed = 500;
let playerName = "";

const addScore = () => {
    score.innerText = +score.innerText + 10;
};

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min);
};

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - size);
    return Math.round(number / 30) * 30;
};

const randomColor = () => {
    const red = randomNumber(0, 255);
    const green = randomNumber(0, 255);
    const blue = randomNumber(0, 255);
    return `rgb(${red}, ${green}, ${blue})`;
};

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor(),
};

const drawFood = () => {
    const { x, y, color } = food;
    ctx.shadowColor = color;
    ctx.shadowBlur = 15;
    ctx.fillStyle = color;
    ctx.fillRect(x, y, size, size);
    ctx.shadowBlur = 0;
};

const drawComputerSnake = () => {
    ctx.fillStyle = "#012b24";
    computerSnake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "#06b89a";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const drawSnake = () => {
    ctx.fillStyle = "#7708d1";
    snake.forEach((position, index) => {
        if (index == snake.length - 1) {
            ctx.fillStyle = "#400470";
        }
        ctx.fillRect(position.x, position.y, size, size);
    });
};

const moveComputerSnake = () => {
    const head = computerSnake.at(-1);
    if (head.x < food.x) {
        computerSnake.push({ x: head.x + size, y: head.y });
    } else if (head.x > food.x) {
        computerSnake.push({ x: head.x - size, y: head.y });
    } else if (head.y < food.y) {
        computerSnake.push({ x: head.x, y: head.y + size });
    } else if (head.y > food.y) {
        computerSnake.push({ x: head.x, y: head.y - size });
    }
    computerSnake.shift();
};

const moveSnake = () => {
    if (!direction) return;
    const head = snake.at(-1);

    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y });
    } else if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y });
    } else if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size });
    } else if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size });
    }
    snake.shift();
};

const drawGrid = () => {
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#191919";

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath(0);
        ctx.lineTo(i, 0);
        ctx.lineTo(i, canvas.width);
        ctx.stroke();

        ctx.beginPath(0);
        ctx.lineTo(0, i);
        ctx.lineTo(canvas.height, i);
        ctx.stroke();
    }
};

const checkCumputerEat = () => {
    const head = computerSnake.at(-1);
    if (head.x == food.x && head.y == food.y) {
        addScore();
        computerSnake.push(head);

        let x = randomPosition();
        let y = randomPosition();

        while (computerSnake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }

        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const checkEat = () => {
    const head = snake.at(-1);
    if (head.x == food.x && head.y == food.y) {
        addScore();
        snake.push(head);
        eatSound.play()
        let x = randomPosition();
        let y = randomPosition();
        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition();
            y = randomPosition();
        }
        food.x = x;
        food.y = y;
        food.color = randomColor();
    }
};

const willCollide = () => {
    const head = snake[snake.length - 1];
    const neckIndex = snake.length - 2;

    const wallColission = head.x < 0 || head.x > canvas.width - size || head.y < 0 || head.y > canvas.height - size;
    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y;
    });
    const computerCollision = computerSnake.find((position) => {
        return position.x == head.x && position.y == head.y;
    });
    if (wallColission || selfCollision || computerCollision) {
        gameOver();
    }
};

const startVersusGame = () => {
    restartGame("versus");
};

const gameOver = () => {
    direction = undefined;
    gameOverSound.play();
    menuOver.style.display = "flex";
    finalScore.innerText = score.innerText;
    canvas.style.filter = "blur(10px)";
    hideScore.style.display = "none";
    buttonOut.style.display = "flex";
    playerNameDisplay.style.display = "flex";
};

const menu = () => {
    menuScreen.style.display = "flex";
    canvas.style.filter = "blur(10px)";
    hideScore.style.display = "none";
};
menu();

const gameLoop = () => {
    clearInterval(loopId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawGrid();
    drawFood();
    drawSnake();
    moveSnake();
    checkEat();
    willCollide();

    if (gameSpeed > 200) gameSpeed -= 1;
    loopId = setTimeout(gameLoop, gameSpeed);
};

const gameVersus = () => {
    clearInterval(loopId);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawFood();
    drawSnake();
    moveSnake();
    checkEat();
    drawComputerSnake();
    moveComputerSnake();
    checkCumputerEat();
    willCollide();

    if (gameSpeed > 200) gameSpeed -= 1;
    loopId = setTimeout(gameVersus, gameSpeed);
};

const restartGame = (mode = "normal") => {
    hideScore.style.display = "flex";
    playerName = playerNameInput.value.trim();
    if (playerName == "") playerName = "Jogador";
    playerNameDisplay.innerText = `Jogador: ${playerName}`;
    menuOver.style.display = "none";
    menuScreen.style.display = "none";
    canvas.style.filter = "none";
    score.innerText = "00";
    snake = [initialPosition];
    gameSpeed = 500;
    if (mode == "versus"){
        computerSnake = [{ x: 30, y: 30 }];
        gameVersus();
    } else {
        gameLoop();
    }
};

document.addEventListener("click", (event) => {
    const head = snake.at(-1);
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    if (mouseX > head.x + size && direction !== "left") {
        direction = "right";
    } else if (mouseX < head.x && direction !== "right") {
        direction = "left";
    } else if (mouseY < head.y && direction !== "down") {
        direction = "up";
    } else if (mouseY > head.y + size && direction !== "up") {
        direction = "down";
    }
});
buttonStart.addEventListener("click", () => {
    backSound.play();
    restartGame();
});

buttonPlay.addEventListener("click", () => {
    backSound.play();
    restartGame();
});

buttonVersus.addEventListener("click", () => {
    backSound.play();
    restartGame("versus");
});
buttonOut.addEventListener("click", () => {
    backSound.play();
    menuOver.style.display = "none"; 
    menu();
    playerNameDisplay.style.display = "none";
    clearTimeout(loopId);
});
