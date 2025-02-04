const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const finalScore = document.querySelector(".final-score > span")
const score = document.querySelector(".score--value")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const size = 30

const initialPosition = {x: 270 , y: 240}

let snake = [{x: 270 , y: 240}]

const addScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) =>{
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () =>{
    const number = randomNumber(0, canvas.width -size)
    return Math.round(number/30) * 30
}

const randomColor = () => {
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = {
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => {
    const{ x, y, color} = food

    ctx.shadowColor = color
    ctx.shadowBlur = 10
    ctx.fillStyle = color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"

    snake.forEach((position, index) => {
        if(index == snake.length -1){
            ctx.fillStyle = "white"
        }
        ctx.fillRect(position.x, position.y, size, size)
    })
}

const moveSnake = () => {
    if(!direction) return
    const head = snake.at(-1)

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }
    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }
    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }

    snake.shift()
}

const drawGrid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for(let i = 30; i<canvas.width; i += 30){
        ctx.beginPath(0)
        ctx.lineTo(i, 0)
        ctx.lineTo(i, 600)
        ctx.stroke()

        ctx.beginPath(0)
        ctx.lineTo(0, i)
        ctx.lineTo(600, i)
        ctx.stroke()
    }
}

const checkEat = () => {
    const head = snake.at(-1)
    if( head.x == food.x && head.y == food.y){
        addScore()
        snake.push(head)

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        food.color = randomColor()
    }
}

const willCollide = () => {
    const head = snake[snake.length - 1]
    const neckIndex = snake.length - 2
    const wallColission = head.x < 0 || head.x > canvas.width - size || head.y < 0 || head.y > canvas.height - size

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x  && position.y == head.y
    })

    if (wallColission || selfCollision){
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(5px)"

}
const gameLoop = () => {
    clearInterval(loopId)
    ctx.clearRect(0, 0, 600, 600)

    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    willCollide()

    loopId = setTimeout(()=> {
        gameLoop()
    }, 300)
}

gameLoop()

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

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})
