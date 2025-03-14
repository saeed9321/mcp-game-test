// Game variables
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let totalPairs = 8;
let moves = 0;
let score = 0;
let gameStarted = false;
let gameTimer;
let seconds = 0;
let minutes = 0;

// DOM elements
const gameBoard = document.querySelector(".game-board");
const gameMessage = document.querySelector(".game-message");
const resultScreen = document.querySelector(".result-screen");
const startButton = document.getElementById("start");
const resetButton = document.getElementById("reset");
const playAgainButton = document.getElementById("play-again");
const timeElement = document.getElementById("time");
const movesElement = document.getElementById("moves");
const scoreElement = document.getElementById("score");
const finalTimeElement = document.getElementById("final-time");
const finalMovesElement = document.getElementById("final-moves");
const finalScoreElement = document.getElementById("final-score");

// Card icons (using Font Awesome)
const cardIcons = [
	"fa-heart",
	"fa-star",
	"fa-bolt",
	"fa-cloud",
	"fa-moon",
	"fa-sun",
	"fa-bell",
	"fa-gem",
	"fa-heart",
	"fa-star",
	"fa-bolt",
	"fa-cloud",
	"fa-moon",
	"fa-sun",
	"fa-bell",
	"fa-gem",
];

// Event listeners
startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
playAgainButton.addEventListener("click", resetGame);

// Initialize the game
function initializeGame() {
	gameBoard.innerHTML = "";
	gameMessage.classList.remove("hidden");
	resultScreen.classList.add("hidden");

	// Reset game variables
	cards = [];
	flippedCards = [];
	matchedPairs = 0;
	moves = 0;
	score = 0;
	seconds = 0;
	minutes = 0;

	// Update UI
	updateStats();

	// Shuffle cards
	const shuffledIcons = shuffleArray([...cardIcons]);

	// Create cards
	shuffledIcons.forEach((icon, index) => {
		const card = createCard(icon, index);
		gameBoard.appendChild(card);
		cards.push(card);
	});
}

// Create a card element
function createCard(icon, index) {
	const card = document.createElement("div");
	card.classList.add("card");
	card.dataset.index = index;

	card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                <i class="fas ${icon}"></i>
            </div>
            <div class="card-back"></div>
        </div>
    `;

	card.addEventListener("click", () => flipCard(card));

	return card;
}

// Flip a card
function flipCard(card) {
	// Prevent flipping if game not started, card already flipped or matched, or two cards already flipped
	if (
		!gameStarted ||
		flippedCards.length >= 2 ||
		card.classList.contains("flipped") ||
		card.classList.contains("matched")
	) {
		return;
	}

	// Flip the card
	card.classList.add("flipped");
	flippedCards.push(card);

	// Check for match if two cards are flipped
	if (flippedCards.length === 2) {
		moves++;
		updateStats();
		checkForMatch();
	}
}

// Check if the flipped cards match
function checkForMatch() {
	const [card1, card2] = flippedCards;
	const icon1 = card1.querySelector(".card-front i").className;
	const icon2 = card2.querySelector(".card-front i").className;

	if (icon1 === icon2) {
		// Cards match
		setTimeout(() => {
			card1.classList.add("matched");
			card2.classList.add("matched");
			flippedCards = [];
			matchedPairs++;
			score += 10;
			updateStats();

			// Check if all pairs are matched
			if (matchedPairs === totalPairs) {
				endGame();
			}
		}, 500);
	} else {
		// Cards don't match
		setTimeout(() => {
			card1.classList.remove("flipped");
			card2.classList.remove("flipped");
			flippedCards = [];
			// Penalty for wrong match
			score = Math.max(0, score - 1);
			updateStats();
		}, 1000);
	}
}

// Start the game
function startGame() {
	if (gameStarted) return;

	gameStarted = true;
	gameMessage.classList.add("hidden");

	// Start the timer
	startTimer();

	// Enable card flipping
	cards.forEach((card) => {
		card.classList.remove("flipped");
		card.classList.remove("matched");
	});
}

// Reset the game
function resetGame() {
	// Stop the timer
	clearInterval(gameTimer);
	gameStarted = false;

	// Reinitialize the game
	initializeGame();
}

// End the game
function endGame() {
	// Stop the timer
	clearInterval(gameTimer);
	gameStarted = false;

	// Update final stats
	finalTimeElement.textContent = timeElement.textContent;
	finalMovesElement.textContent = moves;
	finalScoreElement.textContent = score;

	// Show result screen
	setTimeout(() => {
		resultScreen.classList.remove("hidden");
	}, 500);
}

// Start the timer
function startTimer() {
	clearInterval(gameTimer);
	seconds = 0;
	minutes = 0;
	updateTimer();

	gameTimer = setInterval(() => {
		seconds++;
		if (seconds >= 60) {
			seconds = 0;
			minutes++;
		}
		updateTimer();
	}, 1000);
}

// Update the timer display
function updateTimer() {
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const formattedSeconds = seconds.toString().padStart(2, "0");
	timeElement.textContent = `${formattedMinutes}:${formattedSeconds}`;
}

// Update game stats
function updateStats() {
	movesElement.textContent = moves;
	scoreElement.textContent = score;
}

// Shuffle array (Fisher-Yates algorithm)
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
	return array;
}

// Initialize the game when the page loads
window.addEventListener("DOMContentLoaded", initializeGame);
