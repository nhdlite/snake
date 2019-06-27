'use strict';

window.onload = function() {
    const game = new Game(document);
    const gameController = new GameController(game, document);
    game.startGame();
};
