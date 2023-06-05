function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  const constructBoard = function() {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
  } 

  constructBoard();

  const getBoard = () => board;

  const resetBoard = function() {
    board.length = 0;
    constructBoard();
  }

  const addMark = function(row, column, mark) {
    const cell = board[row][column];
    if (cell.getValue() === "") {
      cell.placeMark(mark);
      return;
    } else {
      return "invalid"; 
    }
  }

  const checkWin = function(mark) {
    const boardToCheck = board.map((row) => row.map((cell) => cell.getValue()))
    const combinationToCheck = [mark, mark, mark];

    for (let i = 0; i < 3; i++) {
      const cellsToCheck = boardToCheck[i];
      const result = compareMarks(cellsToCheck, combinationToCheck);

      if (result == true) {
        return mark;
      }
    }

    for (let i = 0; i < 3; i++) {
      const cellsToCheck = [boardToCheck[0][i], boardToCheck[1][i], boardToCheck[2][i]];
      const result = compareMarks(cellsToCheck, combinationToCheck);

      if (result == true) {
        return mark;
      }
    }

    const diagonalCells1 = [boardToCheck[0][0], boardToCheck[1][1], boardToCheck[2][2]];
    const diagonalCells2 = [boardToCheck[0][2], boardToCheck[1][1], boardToCheck[2][0]];

    const result1 = compareMarks(diagonalCells1, combinationToCheck);

    if (result1 == true) {
      return mark;
    }
    
    const result2 = compareMarks(diagonalCells2, combinationToCheck);

    if (result2 == true) {
      return mark;
    }

    let emptyCells = 9;

    boardToCheck.map(function(row) {
      row.map(function(cell) {
        if (cell != "") {
          emptyCells--;
        }
      })
    })

    if (emptyCells == 0) {
      return "tie";
    }

    return;
  }

  const compareMarks = function(cellsToCheck, combinationToCheck) {
    return cellsToCheck.every((element, index) => {

      if (element === combinationToCheck[index]) {
        return true;
      }

      return false;
    });
  }

  return { getBoard, resetBoard, addMark, checkWin};
}

function Cell() {
  let value = "";

  const getValue = () => value;

  const placeMark = (mark) => {
    value = mark;
  } 

  return { getValue, placeMark };
}

function GameController() {
  const board = new Gameboard();

  const players = [
    {
      name: "Player 1",
      mark: "X"
    },
    {
      name: "Player 2",
      mark: "O"
    }
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const setPlayerNames = function(playerOne, playerTwo) {
    players[0].name = playerOne;
    players[1].name = playerTwo;
  }

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const restartGame = function() {
    activePlayer = players[0];
    board.resetBoard();
  }

  const playRound = function(row, column) {
    
    const move = board.addMark(row, column, getActivePlayer().mark);
    
    if (move == "invalid") {
      return "invalid-move";
    } else {
      const winningMark = board.checkWin(getActivePlayer().mark);

      if (winningMark == getActivePlayer().mark) {
        const winner = getActivePlayer().name;
        return winner;
      } else if (winningMark == "tie") {
        return "tie";
      } else {
        switchPlayerTurn();
      }
    }
  }

  return {
    getActivePlayer,
    setPlayerNames,
    restartGame,
    playRound,
    getBoard: board.getBoard
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnLabel = document.querySelector("#turn");
  const messageContainer = document.querySelector("#message");
  const mainScreen = document.querySelector("#main-screen");
  const startButton = document.querySelector("#start");
  let gameStarted = false;

  const updateScreen = () => {
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    const boardDiv = document.querySelector("#board");

    boardDiv.textContent = "";
    
    messageContainer.textContent = "Click a cell to place a mark.";
    playerTurnLabel.textContent = `${activePlayer.name}'s turn...`

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        
        const cellMarkIcon = document.createElement("img");
        const cellMarkValue = cell.getValue();

        if (cellMarkValue == "X") {
          cellMarkIcon.src = "images/pretzel.png";
        } else if (cellMarkValue == "O") {
          cellMarkIcon.src = "images/donut.png";
        }

        cellButton.appendChild(cellMarkIcon);
        boardDiv.appendChild(cellButton);
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;

    if (!selectedRow || !selectedColumn) {
      messageContainer.textContent = "Invalid cell. Please choose a different cell.";
      return;
    }

    const roundResult = game.playRound(selectedRow, selectedColumn);

    if (roundResult == "invalid-move") {
      messageContainer.textContent = "Invalid cell. Please choose a different cell.";
    } else if (roundResult == "Player One" || roundResult == "Player Two") {
      updateScreen();
      playerTurnLabel.textContent = `${roundResult} won the game!`;
      startButton.textContent = "Play Again";
      messageContainer.textContent = "Click play again below to start a new game.";
      return;
    } else if (roundResult == "tie") {
      updateScreen();
      playerTurnLabel.textContent = `Tie! No one won the game.`;
      startButton.textContent = "Play Again";
      messageContainer.textContent = "Click play again below to start a new game.";
      return;
    }

    updateScreen();
  }

  function clickHandlerStart() {
    if (gameStarted == true) {
      location.reload();
    } else {
      const playerOneName = document.querySelector("#player-one").value;
      const playerTwoName = document.querySelector("#player-two").value;

      if (playerOneName != "" && playerTwoName != "") {
        game.setPlayerNames(playerOneName, playerTwoName);
      } else if (playerOneName == "" && playerTwoName != "") {
        game.setPlayerNames("Player 1", playerTwoName);
      } else if (playerOneName != "" && playerTwoName == "") {
        game.setPlayerNames(playerOneName, "Player 2");
      }

      const playerSelection = document.querySelector("#player-selection");
      playerSelection.remove();

      const board = document.createElement("div");
      board.id = "board";
      mainScreen.appendChild(board);
      board.addEventListener("click", clickHandlerBoard);

      startButton.textContent = "Restart Game";

      gameStarted = true;

      updateScreen();      
    }
  }

  startButton.addEventListener("click", clickHandlerStart);
}

ScreenController();

// Fix some bugs: Player can still place marks on cell even after a game is done