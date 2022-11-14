var origBoard;
let aiPlayer;
let huPlayer;

const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');

restart();
function restart(){
    document.querySelector(".startgame").style.display = "flex";
    document.querySelector(".game").style.display = "none";
    document.querySelector(".endgame").style.display = "none";
}

function start1() {    
    huPlayer = 'X';
    aiPlayer = 'O';
    startGame();
}

function start2() {
    huPlayer = 'O';
    aiPlayer = 'X';
    startGame();
}

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    document.querySelector(".startgame").style.display = "none";
    document.querySelector(".game").style.display = "flex";
    origBoard = Array.from([0,1,2,3,4,5,6,7,8]);
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }    
    if(aiPlayer === 'X'){
        turn(bestSpot(), aiPlayer)
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == 'number') {   //checks whether id of square is a number or not
        turn(square.target.id, huPlayer);
        if (!checkWin(origBoard, huPlayer) && !checkTie()) 
        turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    checkTie();    
    if (gameWon) 
        gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>     //a=initial/returned value of func  e=current element value   i=index of current element
        (e === player) ? a.concat(i) : a,[]);   //plays contains indices of board with the player
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {   //entries() returns an Array Iterator object with key/value pairs
        if (win.every(elem => plays.indexOf(elem) > -1)) {   //if index of the element is -1 : it is not presesnt in win array
            gameWon = { index: index, player: player };   //returns index of win array and player
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == huPlayer ? "rgba(0, 255, 0, 0.2)" : "rgba(255, 0, 0, 0.2)";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You Win!" : "You Lose!");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "flex";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return origBoard.filter(s => typeof s == 'number');  //creates an new array
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "rgba(255,255,255,0.2)";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares();

    if (checkWin(newBoard, huPlayer)) {
        return { score: -1 };
    } else if (checkWin(newBoard, aiPlayer)) {
        return { score: 1 };
    } else if (availSpots.length === 0) {
        return { score: 0 };
    }

    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, huPlayer);  
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }
    

    var bestMove;
    if (player === aiPlayer) {
        var bestScore = -10000;   //corresponds to -infinity 
        for (var i = 0; i < moves.length; i++) {   //maximize alpha
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;   //corresponds to infinity
        for (var i = 0; i < moves.length; i++) {   //minimize beta
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
        
    return moves[bestMove];
}