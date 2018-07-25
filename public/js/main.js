'use strict';

let gameWidth = 500;
let gameHeight = 500;

let pw = 20;
let ph = 20;

let px = (((gameWidth/pw) - 1)/2) * pw;
let py = (((gameHeight/ph) - 1)/2) * ph;
let pxv = 1;
let pyv = 0;
let snake = [{positionX: px, positionY: py}, {positionX: px, positionY: py}, {positionX: px, positionY: py}, {positionX: px, positionY: py}];
let snakeML = 4;
let appleX = 200;
let appleY = 200;
let points = 0;
let highScore = 0;

let xDown = null;                                                        
let yDown = null;                                                        

window.onload = function() {
    let gameCanvas = document.getElementById('gameCanvas');
    let gc = gameCanvas.getContext('2d');
    gc.canvas.width = gameWidth;
    gc.canvas.height = gameHeight;
    gc.fillStyle = '#ff0000';
    gc.fillRect(px,py,pw,ph);

    let scoreboard = document.getElementById('scoreboard');
    let highScoreElement = document.getElementById('highScore');

    function resetGame() {
        px = 0;
        py = 0;
        pxv = 1;
        pyv = 0;
        snake.fill({positionX: px, positionY: py}, 0);
        snakeML = 4;
        if(points > highScore) {
            highScore = points;
            highScoreElement.textContent = `High Score: ${highScore}`;
        }

        points = 0;
    };

    function randomizeApple() {
        appleX = Math.floor(Math.random() * (gameWidth/pw)) * pw;
        appleY = Math.floor(Math.random() * (gameHeight/ph)) * ph;
    }

    function draw() {
        gc.clearRect(0,0,500,500);
        snake.forEach((s) => {
            gc.fillStyle = '#ff0000';
            gc.fillRect(s.positionX, s.positionY, pw, ph); 
        });
        gc.fillStyle = '#00ff00';
        gc.fillRect(appleX, appleY, pw, ph);

        scoreboard.textContent = `Points: ${points}`;
    };

    function move() {
        px += pw * pxv;
        py += ph * pyv;
        if(px >= gameWidth) {
            px = 0;
        }
        if(px < 0) {
            px = gameWidth - pw;
        }
        if(py < 0) {
            py = gameHeight - ph;
        }
        if(py >= gameHeight) {
            py = 0;
        }

        snake.push({positionX: px, positionY: py})
    };

    function cleanUp() {
        while(snake.length > snakeML) {
            snake.shift();
        }
    };

    function collision() {
        let headSnake = snake[snake.length -1];
        if(headSnake.positionX === appleX &&
            headSnake.positionY === appleY) {
            snakeML += 1;
            points += 10;
            randomizeApple();
        }

        for(let i = snake.length -2; i >= 0; i--) {
            if(headSnake.positionX === snake[i].positionX &&
                headSnake.positionY === snake[i].positionY) {
                console.log('Game Over');
                resetGame();
            }
        }
    };

    // TODO: Refactor this out later
    function handleTouchStart(evt) {                                         
        xDown = evt.touches[0].clientX;                                      
        yDown = evt.touches[0].clientY;                                      
    };                                                
    
    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }
    
        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;
    
        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;
    
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                /* left swipe */ 
                pxv = -1;
                pyv = 0;
            } else {
                /* right swipe */
                pxv = 1;
                pyv = 0;
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* up swipe */ 
                pxv = 0;
                pyv = -1;
            } else { 
                /* down swipe */
                pxv = 0;
                pyv = 1;
            }                                                                 
        }
        draw();

        /* reset values */
        xDown = null;
        yDown = null;                                             
    };

    // Mobile event listeners
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    // Desktop event listeners
    document.addEventListener('keydown', function(event) {
        if(event.keyCode === 37) {
            pxv = -1;
            pyv = 0;
        }
        else if (event.keyCode === 38) {
            pxv = 0;
            pyv = -1;
        }
        else if (event.keyCode === 39) {
            pxv = 1;
            pyv = 0;
        }
        else if (event.keyCode === 40) {
            pxv = 0;
            pyv = 1;
        }
        draw();
    });

    setInterval(function() {
        move();
        collision();
        cleanUp();
        draw();
    }, 1000/15);
};

