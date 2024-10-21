let randomNumber;
let attemptsLeft;
const maxAttempts = 3;

function startGame() {
  randomNumber = Math.floor(Math.random() * 2) + 1;
  attemptsLeft = maxAttempts;
  document.getElementById(
    "attemptsLeft"
  ).innerText = `Attempts left: ${attemptsLeft}`;
  document.getElementById("message").innerText = "";
  document.getElementById("countdown").innerText = "";
  document.getElementById("restartButton").style.display = "none";
}

function startCountdown(duration) {
  let countdownTime = duration;
  const countdownDisplay = document.getElementById("countdown");

  const interval = setInterval(() => {
    countdownDisplay.innerText = `Next guess in: ${countdownTime} seconds`;
    countdownTime--;

    if (countdownTime < 0) {
      clearInterval(interval);
      countdownDisplay.innerText = "";
    }
  }, 1000);
}

function guessNumber() {
  const guessInput = document.getElementById("guessInput");
  const guess = Number(guessInput.value);
  guessInput.value = "";

  if (attemptsLeft > 0) {
    attemptsLeft--;
    document.getElementById(
      "attemptsLeft"
    ).innerText = `Attempts left: ${attemptsLeft}`;

    startCountdown(2);

    setTimeout(() => {
      if (guess === randomNumber) {
        document.getElementById("message").innerText =
          "Congratulations! You guessed it right!";
        document.getElementById("restartButton").style.display = "block";
      } else if (guess < randomNumber) {
        document.getElementById(
          "message"
        ).innerText = `Your guess: ${guess} - It's too low! Try again.`;
      } else {
        document.getElementById(
          "message"
        ).innerText = `Your guess: ${guess} - It's too high! Try again.`;
      }

      if (attemptsLeft === 0) {
        document.getElementById(
          "message"
        ).innerText = `Game over! The number was ${randomNumber}.`;
        document.getElementById("restartButton").style.display = "block";
      }
    }, 2000); // 2 seconds delay for showing the result
  }
}

document.getElementById("guessButton").addEventListener("click", guessNumber);
document.getElementById("restartButton").addEventListener("click", startGame);

startGame(); // Start the game when the page loads
