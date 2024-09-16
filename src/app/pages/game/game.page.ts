import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Interface representing a card in the memory game
interface Card {
  value: number; // The value shown on the card
  showValue: boolean; // Whether the value is visible to the player
  disabled: boolean; // Whether the card is disabled and can't be clicked
  color: string; // The color of the card (used for success/failure indication)
}

@Component({
  selector: 'app-game', // The selector used in the HTML template to reference this component
  templateUrl: './game.page.html', // Path to the HTML template
  styleUrls: ['./game.page.scss'], // Path to the stylesheet
})
export class GamePage implements OnInit {
  // Variables for game settings and state
  username: string = ''; // Username of the player
  points: number = 0; // Player's score
  selectedLevel: string = 'medium'; // Difficulty level of the game
  gameStarted: boolean = false; // Flag indicating if the game has started
  gameOver: boolean = false; // Flag indicating if the game is over
  cards: Card[] = []; // Array holding the cards in the game
  targetNumber: number = 0; // Number the player has to find
  initGame: boolean = true; // Flag indicating if the game is in its initial state
  memorizeCards: boolean = false; // Flag indicating if cards are being memorized
  showTarget: boolean = false; // Flag to show the target number
  cardsEnabled: boolean = true; // Flag to enable/disable card clicks
  timeRemaining: number = 0; // Timer for the game
  timer: any; // Holds the reference to the countdown timer
  gameMessage: string = ''; // Message to display after the game ends

  // Constructor with dependencies for route and router navigation
  constructor(private route: ActivatedRoute, private router: Router) {}

  // Lifecycle hook that runs when the component is initialized
  ngOnInit() {
    // Subscribe to the route's query parameters to get the username
    this.route.queryParams.subscribe(params => {
      if (params['username']) {
        this.username = params['username']; // Set the username from query parameters
      } else {
        this.router.navigate(['/']); // If no username is provided, navigate back to the homepage
      }
    });
  }

  // Function to start the memory game
  startMemoryGame() {
    this.initGame = false;
    this.memorizeCards = true;
    this.gameStarted = true;
    this.gameOver = false;
    this.cardsEnabled = true;
    this.showTarget = false;
    this.gameMessage = '';
    this.generateCards(); // Generate new cards for the game
    this.showCards(); // Show the cards briefly for memorization

    // Set the display time based on the selected difficulty level
    let displayTime = 10000;
    switch (this.selectedLevel) {
      case 'low':
        displayTime = 10000;
        this.timeRemaining = 10;
        break;
      case 'medium':
        displayTime = 5000;
        this.timeRemaining = 5;
        break;
      case 'high':
        displayTime = 2000;
        this.timeRemaining = 2;
        break;
    }

    // After the display time, hide the cards and start the countdown
    setTimeout(() => {
      this.hideCards(); // Hide the card values
      this.memorizeCards = false;
      this.showTarget = true;
      this.startCountdown(); // Start the countdown for player action
    }, displayTime);
  }

  // Generate a new set of cards for the game
  generateCards() {
    this.cards = []; // Reset the card array
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]); // Shuffle the numbers 1 to 9
    // Create cards using the shuffled numbers
    numbers.forEach(num => {
      this.cards.push({
        value: num,
        showValue: true, // Initially show the card values
        disabled: false,
        color: 'light'
      });
    });
    this.targetNumber = numbers[Math.floor(Math.random() * numbers.length)]; // Pick a random target number from the cards
  }

  // Show all card values for memorization
  showCards() {
    this.cards.forEach(card => {
      card.showValue = true; // Make the card value visible
      card.disabled = true; // Disable card clicks during memorization
    });
  }

  // Hide all card values after the memorization phase
  hideCards() {
    this.cards.forEach(card => {
      card.showValue = false; // Hide the card value
      card.disabled = false; // Enable card clicks for player interaction
    });
  }

  // Start a countdown timer
  startCountdown() {
    this.timer = setInterval(() => {
      this.timeRemaining--; // Decrease the remaining time by 1 second
      if (this.timeRemaining === 0) {
        this.timeExpired(); // End the game if time runs out
      }
    }, 1000);
  }

  // Function to handle the end of the timer
  timeExpired() {
    clearInterval(this.timer); // Stop the countdown timer
    this.cardsEnabled = false; // Disable card clicks
    this.gameOver = true; // Mark the game as over
    this.gameMessage = `You didn't press in time.<br>Press start to play again.`; // Show failure message
  }

  // Function called when a card is clicked by the player
  selectCard(card: Card) {
    if (!this.cardsEnabled) {
      return; // Prevent card selection if the game is over or time has run out
    }

    clearInterval(this.timer); // Stop the timer as the player has acted
    this.timeRemaining = 0; // Reset the time

    // Check if the selected card matches the target number
    if (card.value === this.targetNumber) {
      card.color = 'success'; // Change the card color to green for success
      card.showValue = true; // Show the card value
      this.cards.forEach(card => {
        card.disabled = false; // Enable all cards after the selection
      });
      this.updatePoints(); // Update the player's score
      this.gameMessage = `You win ${this.getPointsForLevel()} points.<br>Press start to play again.`; // Show success message
      this.gameOver = true; // End the game
    } else {
      card.color = 'danger'; // Change the card color to red for failure
      card.showValue = true; // Show the incorrect card value
      this.gameOver = true; // End the game
      this.gameMessage = `You have failed.<br>Press start to play again.`; // Show failure message
    }

    this.cardsEnabled = false; // Disable further card clicks
  }

  // Get the points awarded based on the difficulty level
  getPointsForLevel(): number {
    switch (this.selectedLevel) {
      case 'low':
        return 10;
      case 'medium':
        return 20;
      case 'high':
        return 30;
      default:
        return 0;
    }
  }

  // Update the player's score based on the difficulty level
  updatePoints() {
    switch (this.selectedLevel) {
      case 'low':
        this.points += 10;
        break;
      case 'medium':
        this.points += 20;
        break;
      case 'high':
        this.points += 30;
        break;
    }
  }

  // Shuffle an array of numbers randomly
  shuffleArray(array: number[]) {
    return array.sort(() => Math.random() - 0.5); // Randomize the order of the array
  }
}
