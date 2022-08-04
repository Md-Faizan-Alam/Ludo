//  TODO: Play the game and look for errors
//  TODO: Find a way to save the game in local storage or else the game will be lost after every reload

import homePieces from './modules/home.js';
import pavement from './modules/pavement.js';
import dice from './modules/dice.js';

const board = document.getElementById('board');
const homeList = document.getElementsByClassName('home');
const places = pavement.places;
const corridor = pavement.corridor;
const checkpoints = pavement.checkpoints;

/*
    Pavement: 
        Pavement is a module containing various different arrays and methods required for us to
        treat the path provided to player as a mathematical construct
    square: 
        Every square shaped box where the piece is allowed to be placed will be referred to as a
        square in this documentation. In order to store information about any given square we will
        create an object with the attributes row and column corresonding to the position of the
        square in terms of the board which has a Grid-Display.
    places: 
        An array of squares that constitute the primary path provided in the board. In other words
        it is the common path used by all players. The first square in this array is the starting
        position of the Red-Player(playerNumber = 0)
    checkpoints: 
        An array containing all the indices of the pavement.places array that correspond to a checkpoint.
    corridor: 
        An array containing 4 elements, each of which themselves are arrays of squares that
        constitute the final and unique path that every player walks through in order to get
        to the center. In other words, it is a 2D array with one dimension corresponding to
        the playerNumber, whereas the other dimension is the ith square of that player's corridor.
*/

dice.pass = () => {
    if (playerList[Player.currentPlayer].trapped() && !dice.queue.includes(6)) {
        Player.switchPlayer();
        dice.queue.shift();
        dice.updateDisplay();
        dice.masterLock = true;
    }
}

/*
    Movement and Positions =>
    startingPoint: 
        It is the attribute of a piece containing an integer i, where the ith square in
        pavement.place is the starting position for the given piece.
    get: 
        It is the index of place array that corresponds to the square located right before the the corridor of
        the given player.
    carrier: 
        It is a 3 digit number that is added to the position of a piece in order to convey the fact that it is
        inside it's corridor. This is done so as to allocate unique position value to every square inside the
        corridors, Otherwise the position of two pieces can match even if they are at two different locations
        creating confusion for the Killing-Mechanism.
    position: 
        It is the attribute of a piece that contains the number of steps that the piece has moved
        from it's starting position. It's initial value is 0.
    moveTo: 
        It is a function that takes an integer i as parameter and moves the piece to the square
        corresponding to the index i in places array. The function returns after the first line if the target
        location is out of bounds.
*/

class Piece {
    static pieceList = [];
    static color = ["red", "green", "yellow", "blue"];
    static noOfPiecesCreated = 0;
    constructor(playerNumber) {
        this.playerNumber = playerNumber;
        this.homeCounterpart = homePieces[Piece.noOfPiecesCreated];
        this.homeCounterpart.addEventListener('click', this.reanimate);

        this.disc = document.createElement('div');
        this.disc.setAttribute('class', 'piece');
        this.disc.style.backgroundColor = Piece.color[this.playerNumber];
        this.disc.addEventListener('click', this.move);
        board.appendChild(this.disc);

        this.startingPoint = 13 * this.playerNumber;
        this.gate = (this.startingPoint + 50) % 52;
        this.carrier = (this.playerNumber + 1) * 100;
        this.position = 0;
        this.sendHome();
        this.innocent = true;
        Piece.pieceList.push(this);
        Piece.noOfPiecesCreated++;
    }

    // Update the CSS of the pieces to set it's position
    updatePosition = () => {
        if (this.position < 100) {
            this.disc.style.gridColumnStart = places[this.position].column;
            this.disc.style.gridRowStart = places[this.position].row;
            this.handleStack();
        }
        else {
            // if-block for when the piece reaches the Final-Home and needs to disappear from the board
            if (this.position == this.carrier + 5) {
                this.disc.style.display = 'none';
            }
            this.disc.style.gridColumnStart = corridor[this.playerNumber][this.position - this.carrier].column;
            this.disc.style.gridRowStart = corridor[this.playerNumber][this.position - this.carrier].row;
        }
    }

    // Checking if the position of the piece is a checkpoint
    onCheckpoint = () => {
        for (let i = 0; i < checkpoints.length; i++) {
            if (checkpoints[i] == this.position) return true;
        }
        return false;
    }

    // Placing a piece on top of another piece if the square involved is a checkpoint
    sitOnTop = ()=>{
        return;
    }

    // Kill every piece that sits below 'this' piece
    kill = ()=>{
        for (let i = 0; i < Piece.pieceList.length; i++) {
            if ((i >= 4 * this.playerNumber) && (i <= (4 * this.playerNumber + 3))) continue;
            if ((this.position == Piece.pieceList[i].position)) {
                console.log(`The piece on position ${this.position} has been killed`)
                Piece.pieceList[i].sendHome();
                this.innocent = false;
            }
        }
    }

    // A function to handle the scenario where pieces get top og each other like a stack
    handleStack = () => {
        if (this.onCheckpoint()){
            this.sitOnTop();
        }else{
            this.kill();
        }
    }

    moveTo = (position) => {
        if (position > (this.carrier + 5)) return;  // Destination is beyond the Final Home
        if (position < 100) position %= 52; // Making sure it's position goes back to 0 on reaching 52
        this.position = position;
        this.updatePosition();
    }

    sendHome = () => {
        this.moveTo(this.startingPoint);
        this.disc.style.display = 'none';
        this.homeCounterpart.style.display = 'initial';
    }

    canPlay = () => {
        return this.playerNumber == Player.currentPlayer;
    }

    reanimate = () => {
        if (this.canPlay() && (!dice.masterLock) && (dice.queue[0] == 6)) {
            this.moveOut();
            dice.queue.shift();
            dice.updateDisplay();
            if (dice.queue.length == 0) {
                dice.masterLock = true;
            }
            console.log(dice.queue);
        }
    }

    /*
        The actual CSS manipulation involved in moving a piece out of it's home is placed inside the moveOut
        method. Since the reanimate method checks for multiple conditions, but for testing purposes, we can
        sometimes need to forcibly place a piece into the field.
    */
    moveOut = () => {
        this.disc.style.display = 'inline-block';
        this.homeCounterpart.style.display = 'none';
    }

    /* 
    The function called when a piece is clicked upon. It is an umbrella method that determines which other
    methods are to be called, according to the current state of the game.
    */
    move = () => {
        if (!this.canPlay()) return;    // A player cannot move if it is not their turn
        if (!dice.masterLock) {
            let steps = dice.queue.shift();
            dice.updateDisplay();
            // The following if-block executes if the piece is going to cross it's corresponding gate
            if ((this.position <= this.gate) && ((this.position + steps) > this.gate && !this.innocent)) {
                this.moveTo(this.carrier + (this.position + steps - this.gate - 1));
            }
            else {
                this.moveTo(this.position + steps);
            }
            // The next player will be allowed to play only if the dice's queue is empty
            if (dice.queue.length == 0) {
                dice.masterLock = true;
                Player.switchPlayer();
            }
            console.log(dice.queue);
        }
    }
}

class Player {
    static currentPlayer = 0;
    constructor(playerNumber) {
        this.playerNumber = playerNumber;
        for (let i = 0; i < 4; i++) {
            new Piece(playerNumber);
        }
    }

    static switchPlayer = () => {
        homeList[Player.currentPlayer].style.border = 'var(--no-border)';
        Player.currentPlayer = (Player.currentPlayer + 1) % 4;
        for(let i=0;i<16;i++){
            Piece.pieceList[i].disc.style.zIndex = 1;
            Piece.pieceList[i].disc.style.pointerEvents = 'none';
        }
        for(let i=0;i<4;i++){
            Piece.pieceList[(4*Player.currentPlayer)+i].disc.style.zIndex = 2;
            Piece.pieceList[(4*Player.currentPlayer)+i].disc.style.pointerEvents = 'all';
        }
        homeList[Player.currentPlayer].style.border = 'var(--turn-border)';
    }

    trapped = () => {
        let result = true;
        for (let i = 0; i < 4; i++) {
            let piece = Piece.pieceList[(4 * this.playerNumber) + i];
            if (!(piece.disc.style.display == 'none')) {
                result = false;
            }
        }
        return result;
    }
}

let playerList = [];
for (let i = 0; i < 4; i++) {
    playerList.push(new Player(i));
}

// let playerList = localStorage.getItem('players');

// if(playerList == null){
//     playerList = [];
//     for (let i = 0; i < 4; i++) {
//         playerList.push(new Player(i));
//     }
// }else{
//     Piece.pieceList = localStorage.getItem('pieces');
// }

// Piece.pieceList[0].moveOut();
// Piece.pieceList[1].moveOut();
// Piece.pieceList[0].moveTo(21);
// Piece.pieceList[4].moveOut();
// Piece.pieceList[5].moveOut();
// Piece.pieceList[4].moveTo(16);

// setInterval(() => {
//     console.log('Game Saved')
//     localStorage.setItem('players',playerList);
//     localStorage.setItem('pieces',Piece.pieceList);
// }, 10000);


homeList[Player.currentPlayer].style.border = 'var(--turn-border)';