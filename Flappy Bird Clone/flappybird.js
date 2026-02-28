
//board setup
let board;
let boardwidth= 360;
let boardHeight = 640;
let context;

//bird setup
let birdWidth = 34;
let birdheight = 24;
let birdX = boardwidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
    x : birdX,
    y: birdY,
    width : birdWidth,
    height : birdheight
}

//pipes setup
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardwidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics and game setup
let velocityX = -2; // pipes moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;

//game initialization
window.onload = function(){
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardwidth;
    context = board.getContext("2d"); // used for drawing on board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load Bird Image
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function(){
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    //Load pipe Images
    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image ();
    bottomPipeImg.src = "./bottompipe.png";

    //Start game loop and input
    requestAnimationFrame(update);
    setInterval(placePipes, 1500); // every 1.5 seconds
    document.addEventListener("keydown", moveBird);
}

// update game loop
function update() {
    requestAnimationFrame(update);
    if(gameOver) {
        return;
    }
    //Clear screen
    context.clearRect(0, 0, board.width, board.height);

    //Update Bird Position
    velocityY += gravity;
   // bird.y += velocityY;
   bird.y = Math.max(bird.y + velocityY, 0) // apply gravity to current bird.y, limit the bird.y to top of canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    //Checks if bird falls off bottom
    if (bird.y > board.height){
        gameOver.true;
    }

    //Update pipes and collisions
    for (let i = 0; i < pipeArray.length; i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height)

        //Score detection
        if(!pipe.passed && bird.x > pipe.x + pipe.width){
            score += 0.5; //Updates the Score
            pipe.passed = true;
        }
        //Collision detection
        if (detectCollision(bird, pipe)){
            gameOver = true;
        }
    }

    // Remove off-screen pipes
    while(pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift(); //Removes first element from Array
    }

    //Draw score and game over text
    context.fillStyle = "white";
    context.font="45px sans-serif";
    context.fillText(score, 5, 45);

    if(gameOver) {
        context.fillText ("GAME OVER", 5, 90);
    }
}
//Pipe placement
function placePipes() {
    if(gameOver) {
        return;
    }

    //0-1 * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = - 3/4 pipeHeight

    //Randomize pipe height

    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight / 2);
    let openingSpace = board.height/4;

//Create top pipe
    let topPipe = {
        img: topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }

    pipeArray.push(topPipe);

    //Create bottom pipe
    let bottompipe = {
        img: bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottompipe);
}

//Bird movement
function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
        //jump
        velocityY = -6;

        //reset game
        if(gameOver){
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
        }
    }
 }

 //Detects Collision
function detectCollision(a, b){
    return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}