const readline = require("readline");

class TicTacToe {
  constructor() {
    this.boardSize = 10;
    this.board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(" ")
    );
    this.players = ["X", "O", "A", "B"];
    this.currentPlayerIndex = 0;
    this.isGameOver = false;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    this.printBoard();
    this.listenForMove();
  }

  printBoard() {
    console.clear();
    console.log("Tic Tac Toe - 4 Players\n");
    for (let row = 0; row < this.boardSize; row++) {
      let rowString = "";
      for (let col = 0; col < this.boardSize; col++) {
        rowString += ` ${this.board[row][col]} `;
        if (col < this.boardSize - 1) {
          rowString += "|";
        }
      }
      console.log(rowString);
      if (row < this.boardSize - 1) {
        console.log("---+".repeat(this.boardSize - 1) + "---");
      }
    }
    console.log("\n");
  }

  makeMove(row, col) {
    if (this.board[row][col] === " ") {
      this.board[row][col] = this.players[this.currentPlayerIndex];
      this.printBoard();

      if (this.checkWinner()) {
        console.log(`Player ${this.players[this.currentPlayerIndex]} wins!`);
        this.isGameOver = true;
        this.rl.close();
      } else if (this.isBoardFull()) {
        console.log("It's a draw!");
        this.isGameOver = true;
        this.rl.close();
      } else {
        this.switchPlayer();
        this.listenForMove();
      }
    } else {
      console.log("Invalid move. Try again.");
      this.listenForMove();
    }
  }

  checkWinner() {
    // Check rows, columns, and diagonals for a winner
    for (let i = 0; i < this.boardSize; i++) {
      if (
        this.checkLine([i, 0], [i, this.boardSize - 1]) ||
        this.checkLine([0, i], [this.boardSize - 1, i])
      ) {
        return true;
      }
    }

    if (
      this.checkLine([0, 0], [this.boardSize - 1, this.boardSize - 1]) ||
      this.checkLine([0, this.boardSize - 1], [this.boardSize - 1, 0])
    ) {
      return true;
    }

    return false;
  }

  checkLine(start, end) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const player = this.players[this.currentPlayerIndex];

    for (let i = 0; i < this.boardSize; i++) {
      if (this.board[startRow + i][startCol + i] !== player) {
        return false;
      }
    }

    return true;
  }

  isBoardFull() {
    for (let row = 0; row < this.boardSize; row++) {
      for (let col = 0; col < this.boardSize; col++) {
        if (this.board[row][col] === " ") {
          return false;
        }
      }
    }
    return true;
  }

  switchPlayer() {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.players.length;
  }

  listenForMove() {
    this.rl.question(
      `Player ${
        this.players[this.currentPlayerIndex]
      }, enter your move (row and column, e.g., 1 2, or press "q" to quit): `,
      (input) => {
        if (input.toLowerCase() === "q") {
          console.log("Quitting the game. Goodbye!");
          this.isGameOver = true;
          this.rl.close();
          return;
        }

        const [row, col] = input.split(" ").map(Number);

        if (
          isNaN(row) ||
          isNaN(col) ||
          row < 1 ||
          row > this.boardSize ||
          col < 1 ||
          col > this.boardSize
        ) {
          console.log(
            `Invalid input. Please enter a valid row and column (1-${this.boardSize}).`
          );
          this.listenForMove();
        } else {
          this.makeMove(row - 1, col - 1);
        }
      }
    );
  }
}

// Start the game
const game = new TicTacToe();
