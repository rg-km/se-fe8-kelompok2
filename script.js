const CELL_SIZE = 20
const CANVAS_SIZE = 600
const REDRAW_INTERVAL = 50
const WIDTH = CANVAS_SIZE / CELL_SIZE
const HEIGHT = CANVAS_SIZE / CELL_SIZE
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
}

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  }
}

function initHeadAndBody() {
  let head = initPosition()
  let body = [{ x: head.x, y: head.y }]
  return {
    head: head,
    body: body,
  }
}

function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake(color) {
  return {
    color: color,
    ...initHeadAndBody(),
    direction: initDirection(),
    heart: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
    ],
    score: 0,
    level: 1,
    speed: 125,
  }
}

let snake = initSnake()

let apples = [
  {
    color: 'red',
    position: initPosition(),
  },
  {
    color: 'green',
    position: initPosition(),
  },
]

let obstacles = [
  { level: 1, 
    walls: [] 
  },
  {
    level: 2,
    walls: [
      {
        startX: 13,
        startY: 20,
        endX: 26,
        endY: 20,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
    ],
  },
  {
    level: 3,
    walls: [
      {
        startX: 23,
        startY: 20,
        endX: 36,
        endY: 20,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
      {
        startX: 9,
        startY: 30,
        endX: 22,
        endY: 30,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
    ],
  },
  {
    level: 4,
    walls: [
      {
        startX: 23,
        startY: 20,
        endX: 36,
        endY: 20,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
      {
        startX: 9,
        startY: 30,
        endX: 22,
        endY: 30,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
      {
        startX: 4,
        startY: 10,
        endX: 17,
        endY: 10,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
    ],
  },
  {
    level: 5,
    walls: [
      {
        startX: 25,
        startY: 10,
        endX: 36,
        endY: 10,
        width: CELL_SIZE / 2,
        height: CELL_SIZE,
      },
      {
        startX: 10,
        startY: 20,
        endX: 100,
        endY: 20,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
      {
        startX: 0,
        startY: 10,
        endX: 0,
        endY: 20,
        width: CELL_SIZE / 2,
        height: CELL_SIZE,
      },
      {
        startX: 0,
        startY: 0,
        endX: 100,
        endY: 0,
        width: CELL_SIZE,
        height: CELL_SIZE / 2,
      },
    ],
  },
]

// for lifepoints
let lifes = []

function drawSnakeHead(ctx, snake) {
  var img

  img = document.getElementById('snake-head');
  ctx.drawImage(img, snake.head.x * CELL_SIZE, snake.head.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
}

function drawScore(snake) {
  let scoreCanvas = document.getElementById('scoreBoard');
  let scoreCtx = scoreCanvas.getContext('2d');

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = '50px Arial';
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 35, scoreCanvas.scrollHeight / 2);
}

function drawSpeed(snake) {
  let speedCanvas = document.getElementById('speedBoard');
  let speedCtx = speedCanvas.getContext('2d');

  speedCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  speedCtx.font = '40px Arial';
  speedCtx.fillStyle = snake.color;
  speedCtx.fillText(snake.speed + '.ms', 10, speedCanvas.scrollHeight / 2);
}

function drawLevel(snake) {
  let levelElement = document.getElementById('snakeLevel')
  levelElement.innerText = 'Level ' + snake.level
}

function drawObstacles(ctx, snake, obstacles) {
  let walls = obstacles.find(function (element) {
    return element.level === snake.level
  }).walls

  ctx.fillStyle = '#534340'
  for (let i = 0; i < walls.length; i++) {
    for (let j = walls[i].startX; j <= walls[i].endX; j++) {
      for (let k = walls[i].startY; k <= walls[i].endY; k++) {
        ctx.fillRect(j * CELL_SIZE, k * CELL_SIZE, walls[i].width, walls[i].height)
      }
    }
  }
}

function drawLifeGain(ctx, life) {
  let lifeImg = document.getElementById('lifepoint')
  setTimeout(function () {
    ctx.drawImage(lifeImg, life.pos.x * CELL_SIZE, life.pos.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
  }, REDRAW_INTERVAL / 2)
}

// main function to be executed
function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById('snakeBoard')
    let ctx = snakeCanvas.getContext('2d')

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // draw the obstacles or walls
    drawObstacles(ctx, snake, obstacles)

    // draw head + body for snake
    drawSnakeHead(ctx, snake)
    var bodyImage = document.getElementById('snake-body')
    for (let i = 1; i < snake.body.length; i++) {
      ctx.drawImage(bodyImage, snake.body[i].x * CELL_SIZE, snake.body[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
    
    // draw apples in random positions
    for (let i = 0; i < apples.length; i++) {
      let apple = apples[i]
      var img = document.getElementById('apple')
      ctx.drawImage(img, apple.position.x * CELL_SIZE, apple.position.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }

    // draw random life point in canvas
    for (let i = 0; i < lifes.length; i++) {
      drawLifeGain(ctx, lifes[i])
    }
    
    // draw heart or lifepoint on top screen
    for (let i = 0; i < snake.heart.length; i++) {
      var img = document.getElementById('heart')
      ctx.drawImage(img, snake.heart[i].x * CELL_SIZE, snake.heart[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }

    drawScore(snake)
    drawSpeed(snake)
    drawLevel(snake)

  }, REDRAW_INTERVAL)
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0
  }
}

// Leveling Cases
function getLevel(score) {
  switch (score) {
    case 5:
      return 2
    case 10:
      return 3
    case 15:
      return 4
    default:
      return 5
  }
}

// Speed increases as the snake level up
function getSpeed(level) {
  return 150 - (level - 1) * 25;
}

// check prime score number
function checkPrime(score) {
  if (score <= 1) {
    return false
  }

  for (var i = 2; i < score; i++) {
    if (score % i === 0) {
      return false
    }
  }

  return true
}


// Eat the apples
function eat(snake, apples) {
  for (let i = 0; i < apples.length; i++) {
    let apple = apples[i]
    if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
      apple.position = initPosition()
      snake.score++

      // Does the snake level up?
      if (snake.score % 5 === 0 && snake.level < 5) {
        snake.level = getLevel(snake.score)
        snake.speed = getSpeed(snake.level)
        document.getElementById('level-up').play()
        alert("You're advance to level" + " " + snake.level)
      }

      // Does the score is prime number?
      if (checkPrime(snake.score)) {
        lifes.push({ pos: initPosition() })
      }

      snake.body.push({ x: snake.head.x, y: snake.head.y })
    }
  }
}

// After eating lifepoint
function eatlifepoint(snake, lifes) {
  for (let i = 0; i < lifes.length; i++) {
    if (snake.head.x === lifes[i].pos.x && snake.head.y === lifes[i].pos.y) {
      snake.heart.push({ x: snake.heart.length + 1, y: 1 })
      lifes.splice(i, 1)
      snake.score++
    }
  }
}

/* These functions control the movements */
function moveLeft(snake) {
  snake.head.x--
  teleport(snake)
  eat(snake, apples)
  eatlifepoint(snake, lifes)
}

function moveRight(snake) {
  snake.head.x++
  teleport(snake)
  eat(snake, apples)
  eatlifepoint(snake, lifes)
}

function moveDown(snake) {
  snake.head.y++
  teleport(snake)
  eat(snake, apples)
  eatlifepoint(snake, lifes)
}

function moveUp(snake) {
  snake.head.y--
  teleport(snake)
  eat(snake, apples)
  eatlifepoint(snake, lifes)
}
/* ------------------------------------ */

function checkObstaclesCollision(snake, obstacles) {
  let walls = obstacles.find(function (element) {
    return element.level === snake.level
  }).walls

  for (let i = 0; i < walls.length; i++) {
    if (snake.head.x >= walls[i].startX && snake.head.x <= walls[i].endX && snake.head.y >= walls[i].startY && snake.head.y <= walls[i].endY) {
      return true
    }
  }

  return false
}

function checkGameover(snakes, obstacles) {
  let isGameover = false
  // Check whether snake collide with its body
  for (let k = 1; k < snakes.body.length; k++) {
    if (snakes.head.x == snakes.body[k].x && snakes.head.y == snakes.body[k].y) {
      isGameover = true
    }
  }

  // Check whether snake collide with obstacles
  if (checkObstaclesCollision(snakes, obstacles)) {
    isGameover = true
  }

  if (isGameover) {
    snake.heart.pop()
    if (snake.heart.length === 0) {
      document.getElementById('game-over').play()
      alert('Game Over!')
      snake = initSnake()
      apples = [
        {
          color: 'red',
          position: initPosition(),
        },
        {
          color: 'green',
          position: initPosition(),
        },
      ]
    } else {
      snake = {
        ...snake,
        ...initHeadAndBody(),
      }
    }
  }
  return isGameover
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake)
      break
    case DIRECTION.RIGHT:
      moveRight(snake)
      break
    case DIRECTION.DOWN:
      moveDown(snake)
      break
    case DIRECTION.UP:
      moveUp(snake)
      break
  }

  moveBody(snake)
  if (!checkGameover(snake, obstacles)) {
    setTimeout(function () {
      move(snake)
    }, snake.speed)
  } else {
    initGame()
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y })
  snake.body.pop()
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  }

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction
  }
}

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') {
    turn(snake, DIRECTION.LEFT)
  } else if (event.key === 'ArrowRight') {
    turn(snake, DIRECTION.RIGHT)
  } else if (event.key === 'ArrowUp') {
    turn(snake, DIRECTION.UP)
  } else if (event.key === 'ArrowDown') {
    turn(snake, DIRECTION.DOWN)
  }
})

function initGame() {
  move(snake)
}

initGame()