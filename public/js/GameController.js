'use strict';

class GameController {
    constructor(game, document) {
        this.game = game;
        this.xDown = null;
        this.yDown = null;

        document.addEventListener('touchstart', this.handleTouchStart.bind(this));        
        document.addEventListener('touchmove', this.handleTouchMove.bind(this));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
    }

    handleTouchStart(evt) {                                         
        this.xDown = evt.touches[0].clientX;                                      
        this.yDown = evt.touches[0].clientY;                                      
    }

    handleTouchMove(event) {
        this.game.isStart = false;
        if ( !this.xDown || !this.yDown ) {
            return;
        }
    
        const xUp = event.touches[0].clientX;                                    
        const yUp = event.touches[0].clientY;
    
        const xDiff = this.xDown - xUp;
        const yDiff = this.yDown - yUp;
    
        // Determine in what direction the user swiped the most
        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 ) {
                /* left swipe */ 
                this.game.playerXVelocity = -1;
                this.game.playerYVelocity = 0;
            } else {
                /* right swipe */
                this.game.playerXVelocity = 1;
                this.game.playerYVelocity = 0;
            }                       
        } else {
            if ( yDiff > 0 ) {
                /* up swipe */ 
                this.game.playerXVelocity = 0;
                this.game.playerYVelocity = -1;
            } else { 
                /* down swipe */
                this.game.playerXVelocity = 0;
                this.game.playerYVelocity = 1;
            }                                                                 
        }
        this.game.drawGame();

        /* reset values */
        this.xDown = null;
        this.yDown = null;                          
    }

    handleKeyDown(event) {
        this.game.isStart = false;
        if(event.keyCode === 37) {
            this.game.playerXVelocity = -1;
            this.game.playerYVelocity = 0;
        }
        else if (event.keyCode === 38) {
            this.game.playerXVelocity = 0;
            this.game.playerYVelocity = -1;
        }
        else if (event.keyCode === 39) {
            this.game.playerXVelocity = 1;
            this.game.playerYVelocity = 0;
        }
        else if (event.keyCode === 40) {
            this.game.playerXVelocity = 0;
            this.game.playerYVelocity = 1;
        }

        this.game.drawGame();
    }
}