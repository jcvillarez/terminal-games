const readline = require("readline");

class Minesweeper {
  constructor(rows, cols, mines) {
    this.rows = rows;
    this.cols = cols;
    this.mines = mines;
    this.board = this.createBoard();
    this.gameOver = false;
    this.remainingCells = rows * cols - mines;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  createBoard() {
    const board = [];
    for (let i = 0; i < this.rows; i++) {
      const row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push({
          isMine: false,
          isRevealed: false,
          count: 0,
        });
      }
      board.push(row);
    }
    this.placeMines(board);
    this.calculateAdjacentCounts(board);
    return board;
  }

  placeMines(board) {
    let minesPlaced = 0;
    while (minesPlaced < this.mines) {
      const row = Math.floor(Math.random() * this.rows);
      const col = Math.floor(Math.random() * this.cols);
      if (!board[row][col].isMine) {
        board[row][col].isMine = true;
        minesPlaced++;
      }
    }
  }

  calculateAdjacentCounts(board) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!board[i][j].isMine) {
          for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
              const newRow = i + dx;
              const newCol = j + dy;
              if (
                newRow >= 0 &&
                newRow < this.rows &&
                newCol >= 0 &&
                newCol < this.cols
              ) {
                if (board[newRow][newCol].isMine) {
                  board[i][j].count++;
                }
              }
            }
          }
        }
      }
    }
  }

  printBoard() {
    for (let i = 0; i < this.rows; i++) {
      let rowString = "";
      for (let j = 0; j < this.cols; j++) {
        const cell = this.board[i][j];
        if (cell.isRevealed) {
          if (cell.isMine) {
            rowString += " * ";
          } else {
            rowString += ` ${cell.count || " "} `;
          }
        } else {
          rowString += " - ";
        }
      }
      console.log(rowString);
    }
  }

  revealCell(row, col) {
    const cell = this.board[row][col];
    if (cell.isRevealed || this.gameOver) {
      return;
    }

    cell.isRevealed = true;
    this.remainingCells--;

    if (cell.isMine) {
      this.gameOver = true;
      this.endGame(false);
    } else if (this.remainingCells === 0) {
      this.gameOver = true;
      this.endGame(true);
    } else if (cell.count === 0) {
      this.revealEmptyCells(row, col);
    }

    this.printBoard();
  }

  revealEmptyCells(row, col) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (
          newRow >= 0 &&
          newRow < this.rows &&
          newCol >= 0 &&
          newCol < this.cols
        ) {
          this.revealCell(newRow, newCol);
        }
      }
    }
  }

  endGame(isWinner) {
    this.rl.close();
    if (isWinner) {
      console.log("Congratulations! You won!");
    } else {
      console.log("Game over! You hit a mine.");
    }
  }

  play() {
    console.log("Welcome to Minesweeper!");
    this.printBoard();

    const askForMove = () => {
      this.rl.question("Enter row and column (e.g., 1 2): ", (input) => {
        const [row, col] = input.split(" ").map(Number);
        if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
          this.revealCell(row, col);
          askForMove();
        } else {
          console.log("Invalid input. Try again.");
          askForMove();
        }
      });
    };

    askForMove();
  }
}

// Example: Create a Minesweeper game with 8 rows, 8 columns, and 10 mines.
const game = new Minesweeper(8, 8, 10);
game.play();
