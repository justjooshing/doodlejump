//game area
const grid = document.getElementById("grid");

/// define and set grid size
const gameHeight = 600;
const gameWidth = 400;
grid.style.height = `${gameHeight}px`;
grid.style.width = `${gameWidth}px`;

//sprite create
const sprite = document.createElement("div");
let spriteSpaceLeft = 50;
let startPoint = 100;
let spriteSpaceBottom = startPoint + 15;

const createSprite = () => {
  grid.appendChild(sprite);
  spriteSpaceLeft = platforms[0].left;
  sprite.classList.add("sprite");
  sprite.style.left = `${spriteSpaceLeft}px`;
  sprite.style.bottom = `${spriteSpaceBottom}px`;
};

//sprite move
const move = (event) => {
  //Move left
  if (event.key === "ArrowLeft" || event.key === "a") {
    if (spriteSpaceLeft > 0) {
      spriteSpaceLeft -= 10;
      sprite.style.left = `${spriteSpaceLeft}px`;
    }
    //Move right
  } else if (event.key === "ArrowRight" || event.key === "d") {
    if (spriteSpaceLeft < gameWidth - 87) {
      // 87 is sprite width
      spriteSpaceLeft += 10;
      sprite.style.left = `${spriteSpaceLeft}px`;
    }
  }
};

let fallIntervalTimer;
let jumpIntervalTimer;
let isJumping = false;

const fall = () => {
  isJumping = false;
  clearInterval(jumpIntervalTimer);
  fallIntervalTimer = setInterval(() => {
    spriteSpaceBottom -= 5;
    sprite.style.bottom = `${spriteSpaceBottom}px`;
    if (spriteSpaceBottom <= -5) {
      gameOver();
    }
    platforms.forEach((platform) => {
      if (
        spriteSpaceBottom >= platform.bottom &&
        spriteSpaceBottom < platform.bottom + 15 &&
        spriteSpaceLeft + 80 >= platform.left &&
        spriteSpaceLeft < platform.left + 85
      ) {
        startPoint = spriteSpaceBottom;
        jump();
      }
    });
  }, 20);
};

const jump = () => {
  if (!isJumping) {
    isJumping = true;
    clearInterval(fallIntervalTimer);
    jumpIntervalTimer = setInterval(() => {
      spriteSpaceBottom += 10;
      sprite.style.bottom = `${spriteSpaceBottom}px`;

      if (spriteSpaceBottom > startPoint + 200) {
        fall();
      }
    }, 10);

    score();
  }
};

//platform create
let platforms = [];

const createPlatforms = () => {
  const platCount = 5;
  for (let i = 0; i < platCount; i++) {
    const platGap = gameHeight / platCount;
    const newPlatBottom = 100 + i * platGap;
    const newPlatform = new Platform(newPlatBottom);
    platforms.push(newPlatform);
  }
};

class Platform {
  constructor(newPlatBottom) {
    this.bottom = newPlatBottom;
    this.left = Math.random() * (gameWidth - 85);

    this.platformObject = document.createElement("div");
    const platformObject = this.platformObject;
    platformObject.classList.add("platform");
    platformObject.style.left = `${this.left}px`;
    platformObject.style.bottom = `${this.bottom}px`;
    grid.appendChild(platformObject);
  }
}

//platform move
const platformMove = () => {
  if (spriteSpaceBottom > 0) {
    //while active keep moving platforms
    platforms.forEach((platform) => {
      platform.bottom -= 1;
      const platformObject = platform.platformObject;
      platformObject.style.bottom = `${platform.bottom}px`;

      if (platform.bottom < 5) {
        const firstPlatform = platforms[0].platformObject;
        firstPlatform.classList.remove("platform");
        platforms.shift();
        grid.removeChild(firstPlatform);
        const newPlatform = new Platform(600);
        platforms.push(newPlatform);
      }
    });
  }
};

//score
const scoreDiv = document.getElementById("running-score");
let currentScore = 0;
const score = () => {
  currentScore++;
  scoreDiv.textContent = currentScore;
};

//game start
const gameStart = () => {
  currentScore = 0;
  platforms = [];
  isJumping = false;
  createPlatforms();
  createSprite();
  setInterval(platformMove, 15);
  document.addEventListener("keydown", move);
  jump();
  const endGame = document.getElementById("end-game");
  endGame.style.display = "none";
  scoreDiv.style.display = "block";
};

//game end
const gameOver = () => {
  clearInterval(jumpIntervalTimer);
  clearInterval(fallIntervalTimer);
  const endGame = document.getElementById("end-game");
  const finalScore = document.getElementById("final-score");
  finalScore.textContent = currentScore;
  endGame.style.display = "flex";
  scoreDiv.style.display = "hidden";
  restartButton.addEventListener("click", gameStart);

  while (grid.lastChild) {
    if (grid.lastChild) {
      grid.removeChild(grid.lastChild);
    }
  }
};

// restart game
const restartButton = document.getElementById("restart");

//Run
gameStart();
