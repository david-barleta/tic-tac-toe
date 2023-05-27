function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const addMark = function(row, column, mark) {
    const cell = board[row][column];
    if (cell.getValue() === 0) {
      console.log("Valid move.");
      cell.placeMark(mark);
      return "valid";
    } else {
      console.log(`Invalid cell. Please choose a different cell.`)
      return "invalid"; 
    }
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  }

  const checkWin = function(mark) {
    const boardToCheck = board.map((row) => row.map((cell) => cell.getValue()))
    const combinationToCheck = [mark, mark, mark];

    console.log("Checking horizontal cells...");

    for (let i = 0; i < 3; i++) {
      const cellsToCheck = boardToCheck[i];
      const result = compareMarks(cellsToCheck, combinationToCheck);

      if (result == true) {
        return mark;
      }
    }

    console.log("Checking vertical cells...");

    for (let i = 0; i < 3; i++) {
      const cellsToCheck = [boardToCheck[0][i], boardToCheck[1][i], boardToCheck[2][i]];
      const result = compareMarks(cellsToCheck, combinationToCheck);

      if (result == true) {
        return mark;
      }
    }

    console.log("Checking diagonal cells...");

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

  return { getBoard, addMark, printBoard, checkWin };
}

const board = new Gameboard();

function Cell() {
  let value = 0 // Why let?

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

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = function(row, column) {

    if (row > 2 || column > 2) {
      console.log("Invalid cell. Please choose a different cell.");
      return;
    }

    console.log(`Placing ${getActivePlayer().name}'s mark into row ${row} column ${column}...`);
    
    const result = board.addMark(row, column, getActivePlayer().mark);
    
    if (result == "valid") {
      
      const winner = board.checkWin(getActivePlayer().mark);

      if (winner == getActivePlayer().mark) {
        console.log(`${getActivePlayer().name} has won the game.`);
        activePlayer = players[0];
        return;
      }

      switchPlayerTurn();
    }

    printNewRound();
  }

  printNewRound();

  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();