const readline = require("readline");

class NumberGuessingGame {
  constructor() {
    this.secretNumber = this.generateRandomNumber();
    this.attempts = 0;
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("Welcome to the Number Guessing Game!");
    console.log("Try to guess the secret number between 1 and 100.\n");

    this.askForGuess();
  }

  generateRandomNumber() {
    return Math.floor(Math.random() * 100) + 1;
  }

  askForGuess() {
    this.rl.question("Enter your guess: ", (input) => {
      const guess = parseInt(input);

      if (isNaN(guess) || guess < 1 || guess > 100) {
        console.log("Invalid input. Please enter a number between 1 and 100.");
        this.askForGuess();
      } else {
        this.attempts++;
        this.checkGuess(guess);
      }
    });
  }

  checkGuess(guess) {
    if (guess === this.secretNumber) {
      console.log(
        `Congratulations! You guessed the correct number in ${this.attempts} attempts.`
      );
      this.rl.close();
    } else {
      const hint = guess < this.secretNumber ? "higher" : "lower";
      console.log(`Incorrect! Try a ${hint} number.`);
      this.askForGuess();
    }
  }
}

// Start the game
const game = new NumberGuessingGame();
