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
  let value = ""; // Why let?

  const getValue = () => value;

  const placeMark = (mark) => {
    value = mark;
  } 

  return { getValue, placeMark };
}

function GameController(
  playerOneName = "Player One", // Why are the arguments initialized here?
  playerTwoName = "Player Two"
) {
  const board = new Gameboard();

  const players = [
    {
      name: playerOneName,
      mark: "X"
    },
    {
      name: playerTwoName,
      mark: "O"
    }
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const resetGame = function() {
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
        resetGame();
        return winner;
      } else {
        switchPlayerTurn();
      }
    }
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnLabel = document.querySelector(".turn");
  const messageContainer = document.querySelector(".message");
  const boardDiv = document.querySelector(".board");

  const updateScreen = () => {

    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    
    playerTurnLabel.textContent = `${activePlayer.name}'s turn...`

    board.forEach((row, rowIndex) => {
      row.forEach((cell, columnIndex) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = columnIndex;
        cellButton.textContent = cell.getValue();
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
      messageContainer.textContent = `${roundResult} won the game!`;
    }

    updateScreen();
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  updateScreen(); // Initial render
}

ScreenController();