'use strict';

const DEFAULT_SNAKE_LENGTH = 4;

class Game {
    constructor(document) {
        this.gameWidth = 500;
        this.gameHeight = 500;

        this.playerWidth = 20;
        this.playerHeight = 20;
        
        this.playerXCoordinate = this.gameStartX();
        this.playerYCoordinate = this.gameStartY();

        const gameCanvas = document.getElementById('gameCanvas');
        this.gameContext = gameCanvas.getContext('2d');
        this.gameContext.canvas.width = this.gameWidth;
        this.gameContext.canvas.height = this.gameHeight;
        this.gameContext.fillStyle = '#ff0000';
        this.gameContext.fillRect(this.playerXCoordinate, this.playerYCoordinate, this.playerWidth, this.playerHeight);

        this.scoreboard = document.getElementById('scoreboard');
        this.highScoreElement = document.getElementById('highScore');
        
        this.playerXVelocity = 0;
        this.playerYVelocity = 0;
        
        this.snakeMaxLength = DEFAULT_SNAKE_LENGTH;
        this.snakeTiles = new Array(this.snakeMaxLength).fill({positionX: this.playerXCoordinate, positionY: this.playerYCoordinate});

        this.appleXCoordinate = 200;
        this.appleYCoordinate = 200;
        
        this.points = 0;
        this.highScore = 0;

        this.isStart = true;
    }

    gameStartX() {
        return (((this.gameWidth/this.playerWidth) - 1)/2) * this.playerWidth;
    }

    gameStartY() {
        return (((this.gameHeight/this.playerHeight) - 1)/2) * this.playerHeight;
    }

    resetGame() {
        this.playerXCoordinate = this.gameStartX();
        this.playerYCoordinate = this.gameStartY();
        this.playerXVelocity = 0;
        this.playerYVelocity = 0;
        this.snakeTiles.fill({positionX: this.playerXCoordinate, positionY: this.playerYCoordinate});
        this.snakeMaxLength = DEFAULT_SNAKE_LENGTH;
        if(this.points > this.highScore) {
            this.highScore = this.points;
            this.highScoreElement.textContent = `High Score: ${this.highScore}`;
        }

        this.points = 0;
        this.isStart = true;
    }

    moveSnake() {
        this.playerXCoordinate += this.playerWidth * this.playerXVelocity;
        this.playerYCoordinate += this.playerHeight * this.playerYVelocity;
        if(this.playerXCoordinate >= this.gameWidth) {
            this.playerXCoordinate = 0;
        }
        if(this.playerXCoordinate < 0) {
            this.playerXCoordinate = this.gameWidth - this.playerWidth;
        }
        if(this.playerYCoordinate < 0) {
            this.playerYCoordinate = this.gameHeight - this.playerHeight;
        }
        if(this.playerYCoordinate >= this.gameHeight) {
            this.playerYCoordinate = 0;
        }

        this.snakeTiles.push({positionX: this.playerXCoordinate, positionY: this.playerYCoordinate})
    }

    randomizeApple() {
        this.appleXCoordinate = Math.floor(Math.random() * (this.gameWidth/this.playerWidth)) * this.playerWidth;
        this.appleYCoordinate = Math.floor(Math.random() * (this.gameHeight/this.playerHeight)) * this.playerHeight;

        // TODO: rafactor this. There is shared collision logic here and below when we are detecting points and the game over case.
        this.snakeTiles.forEach((snakeBody) => {
            if(snakeBody.positionX === this.appleXCoordinate &&
                snakeBody.positionY === this.appleYCoordinate) {
                this.randomizeApple();
            }
        }); 
    }

    checkForCollisions() {
        let headSnake = this.snakeTiles[this.snakeTiles.length -1];
        if(headSnake.positionX === this.appleXCoordinate &&
            headSnake.positionY === this.appleYCoordinate) {
            this.snakeMaxLength += 1;
            this.points += 10;
            this.randomizeApple();
        }

        for(let i = this.snakeTiles.length -2; i >= 0; i--) {
            if(headSnake.positionX === this.snakeTiles[i].positionX &&
                headSnake.positionY === this.snakeTiles[i].positionY) {
                this.resetGame();
            }
        }
    }

    cleanUpAssets() {
        while(this.snakeTiles.length > this.snakeMaxLength) {
            this.snakeTiles.shift();
        }
    }

    drawGame() {
        this.gameContext.clearRect(0,0,500,500);
        this.snakeTiles.forEach((snakeBody) => {
            this.gameContext.fillStyle = '#ff0000';
            this.gameContext.fillRect(snakeBody.positionX, snakeBody.positionY, this.playerWidth, this.playerHeight); 
        });
        this.gameContext.fillStyle = '#00ff00';
        this.gameContext.fillRect(this.appleXCoordinate, this.appleYCoordinate, this.playerWidth, this.playerHeight);

        this.scoreboard.textContent = `Points: ${this.points}`;
    }

    runGameLoop() {
        if (!this.isStart) {
            this.moveSnake();
            this.checkForCollisions();
            this.cleanUpAssets();
            this.drawGame();
        }

        setTimeout(this.runGameLoop.bind(this), 1000/15); // Run at 15 frames a second
    }

    startGame() {
        this.runGameLoop();
    }
}