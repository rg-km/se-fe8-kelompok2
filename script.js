const CELL_SIZE = 20;
const CANVAS_SIZE = 600;
const REDRAW_INTERVAL = 50;
const WIDTH = CANVAS_SIZE / CELL_SIZE;
const HEIGHT = CANVAS_SIZE / CELL_SIZE;
const DIRECTION = {
  LEFT: 0,
  RIGHT: 1,
  UP: 2,
  DOWN: 3,
};
let MOVE_INTERVAL = 125;

function initPosition() {
  return {
    x: Math.floor(Math.random() * WIDTH),
    y: Math.floor(Math.random() * HEIGHT),
  };
}

function initHeadAndBody() {
  let head = initPosition();
  let body = [{ x: head.x, y: head.y }];
  return {
    head: head,
    body: body,
  };
}
console.log(initHeadAndBody());
function initDirection() {
  return Math.floor(Math.random() * 4);
}

function initSnake() {
  return {
    ...initHeadAndBody(),
    direction: initDirection(),
    score: 0,
    heart: 3,
  };
}
let snake1 = initSnake();

let apple1 = {
  position: initPosition(),
};

let apple2 = {
  position: initPosition(),
};

let heart = {
  position: initPosition(),
};

function drawImg(ctx, img, x, y) {
  ctx.drawImage(img, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

//score
function drawScore(snake) {
  let scoreCanvas;
  scoreCanvas = document.getElementById("scoreBoard");
  let scoreCtx = scoreCanvas.getContext("2d");

  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "70px Arial";
  scoreCtx.fillStyle = snake.color;
  scoreCtx.fillText(snake.score, 80, 125);
}

//speed
function drawSpeed(snake) {
  let speedCanvas;
  speedCanvas = document.getElementById("speedBoard");
  let scoreCtx = speedCanvas.getContext("2d");

  if (snake.score == 5) {
    MOVE_INTERVAL = 110;
  } else if (snake.score == 10) {
    MOVE_INTERVAL = 95;
  } else if (snake.score == 15) {
    MOVE_INTERVAL = 80;
  } else if (snake.score == 20) {
    MOVE_INTERVAL = 65;
  } else if (snake.score == 25) {
    MOVE_INTERVAL = 50;
  }
  scoreCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  scoreCtx.font = "50px Arial";
  scoreCtx.fillText(MOVE_INTERVAL, 55, 120);
  scoreCtx.fillText("MS", 60, 170);
}

function drawLife(snake) {
  let lifeCanvas;
  lifeCanvas = document.getElementById("lifeBoard");
  let lifeCtx = lifeCanvas.getContext("2d");

  lifeCtx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  lifeCtx.font = "30px Arial";
  lifeCtx.fillText(snake.heart, 10, lifeCanvas.scrollHeight / 2);
}

function draw() {
  setInterval(function () {
    let snakeCanvas = document.getElementById("snakeBoard");
    let ctx = snakeCanvas.getContext("2d");
    let imgApp = document.getElementById("apel");
    let imgHead = document.getElementById("head");
    let imgBody = document.getElementById("body");
    let imgHeart = document.getElementById("heart");

    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    //draw snake
    drawImg(ctx, imgHead, snake1.head.x, snake1.head.y);
    for (let i = 1; i < snake1.body.length; i++) {
      drawImg(ctx, imgBody, snake1.body[i].x, snake1.body[i].y);
    }

    //draw apple
    drawImg(ctx, imgApp, apple1.position.x, apple1.position.y);
    drawImg(ctx, imgApp, apple2.position.x, apple2.position.y);

    //draw remaining heart
    for (let k = 0; k < snake1.heart; k++) {
      drawImg(ctx, imgHeart, k, 0);
    }

    //draw heart icon
    let prime = 0;
    for (let j = 1; j <= snake1.score; j++) {
      if (snake1.score % j == 0) {
        prime++;
      }
    }
    if (prime == 2) {
      drawImg(ctx, imgHeart, heart.position.x, heart.position.y);
    }

    draw;

    drawScore(snake1);
    drawLife(snake1);
    drawSpeed(snake1);
  }, REDRAW_INTERVAL);
}

function teleport(snake) {
  if (snake.head.x < 0) {
    snake.head.x = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.x >= WIDTH) {
    snake.head.x = 0;
  }
  if (snake.head.y < 0) {
    snake.head.y = CANVAS_SIZE / CELL_SIZE - 1;
  }
  if (snake.head.y >= HEIGHT) {
    snake.head.y = 0;
  }
}

function eatApple(snake, apple) {
  if (snake.head.x == apple.position.x && snake.head.y == apple.position.y) {
    apple.position = initPosition();
    snake.score++;
    snake.body.push({ x: snake.head.x, y: snake.head.y });
  }
}
function getLife(snake, heart) {
  if (snake.head.x == heart.position.x && snake.head.y == heart.position.y) {
    heart.position = initPosition();
    snake.heart++;
    snake.score++;
  }
}

function moveLeft(snake) {
  snake.head.x--;
  teleport(snake);
  eatApple(snake, apple1);
  eatApple(snake, apple2);
  getLife(snake, heart);
}

function moveRight(snake) {
  snake.head.x++;
  teleport(snake);
  eatApple(snake, apple1);
  eatApple(snake, apple2);
  getLife(snake, heart);
}

function moveDown(snake) {
  snake.head.y++;
  teleport(snake);
  eatApple(snake, apple1);
  eatApple(snake, apple2);
  getLife(snake, heart);
}

function moveUp(snake) {
  snake.head.y--;
  teleport(snake);
  eatApple(snake, apple1);
  eatApple(snake, apple2);
  getLife(snake, heart);
}

function checkCollision(snakes) {
  let isCollide = false;
  //this
  for (let i = 0; i < snakes.length; i++) {
    for (let j = 0; j < snakes.length; j++) {
      for (let k = 1; k < snakes[j].body.length; k++) {
        if (snakes[i].head.x == snakes[j].body[k].x && snakes[i].head.y == snakes[j].body[k].y) {
          isCollide = true;
        }
      }
    }
  }
  if (isCollide) {
    var bel = new Audio("assets/game-over.mp3");
    bel.play();

    alert("Game over");
    snake1 = initSnake("purple");
  }
  return isCollide;
}

function move(snake) {
  switch (snake.direction) {
    case DIRECTION.LEFT:
      moveLeft(snake);
      break;
    case DIRECTION.RIGHT:
      moveRight(snake);
      break;
    case DIRECTION.DOWN:
      moveDown(snake);
      break;
    case DIRECTION.UP:
      moveUp(snake);
      break;
  }
  moveBody(snake);
  if (!checkCollision([snake1])) {
    setTimeout(function () {
      move(snake);
    }, MOVE_INTERVAL);
  } else {
    initGame();
  }
}

function moveBody(snake) {
  snake.body.unshift({ x: snake.head.x, y: snake.head.y });
  snake.body.pop();
}

function turn(snake, direction) {
  const oppositeDirections = {
    [DIRECTION.LEFT]: DIRECTION.RIGHT,
    [DIRECTION.RIGHT]: DIRECTION.LEFT,
    [DIRECTION.DOWN]: DIRECTION.UP,
    [DIRECTION.UP]: DIRECTION.DOWN,
  };

  if (direction !== oppositeDirections[snake.direction]) {
    snake.direction = direction;
  }
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    turn(snake1, DIRECTION.LEFT);
  } else if (event.key === "ArrowRight") {
    turn(snake1, DIRECTION.RIGHT);
  } else if (event.key === "ArrowUp") {
    turn(snake1, DIRECTION.UP);
  } else if (event.key === "ArrowDown") {
    turn(snake1, DIRECTION.DOWN);
  }
});

function initGame() {
  move(snake1);
}

initGame();
