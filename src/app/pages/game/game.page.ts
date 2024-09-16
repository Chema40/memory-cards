import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface Card {
  value: number;
  showValue: boolean;
  disabled: boolean;
  color: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {
  username: string = '';
  points: number = 0;
  selectedLevel: string = 'medium';
  gameStarted: boolean = false;
  gameOver: boolean = false;
  cards: Card[] = [];
  targetNumber: number = 0;
  initGame: boolean = true
  memorizeCards: boolean = false
  showTarget: boolean = false;  
  cardsEnabled: boolean = true; 
  timeRemaining: number = 0;  
  timer: any; 
  gameMessage: string = ''; 


  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['username']) {
        this.username = params['username'];
      } else {
        this.router.navigate(['/']);
      }
    });
  }

  startMemoryGame() {
    this.initGame = false
    this.memorizeCards = true
    this.gameStarted = true;
    this.gameOver = false;
    this.cardsEnabled = true;
    this.showTarget = false;
    this.gameMessage = '';
    this.generateCards();
    this.showCards();

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

    setTimeout(() => {
      this.hideCards();
      this.memorizeCards = false
      this.showTarget = true;
      this.startCountdown(); 
    }, displayTime);
  }

  generateCards() {
    this.cards = [];
    const numbers = this.shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    numbers.forEach(num => {
      this.cards.push({
        value: num,
        showValue: true,
        disabled: false,
        color: 'light'
      });
    });
    this.targetNumber = numbers[Math.floor(Math.random() * numbers.length)];
  }

  showCards() {
    this.cards.forEach(card => {
      card.showValue = true;
      card.disabled = true;
    });
  }

  hideCards() {
    this.cards.forEach(card => {
      card.showValue = false;
      card.disabled = false;
    });
  }

  startCountdown() {
    this.timer = setInterval(() => {
      this.timeRemaining--;
      if (this.timeRemaining === 0) {
        this.timeExpired();
      }
    }, 1000);
  }

  timeExpired() {
    clearInterval(this.timer);  
    this.cardsEnabled = false;  
    this.gameOver = true;
    this.gameMessage = `You didn't press in time.<br>Press start to play again.`;       
  }

  selectCard(card: Card) {
    if (!this.cardsEnabled) {
      return; 
    }

    clearInterval(this.timer);  
    this.timeRemaining = 0; 
    if (card.value === this.targetNumber) {
      card.color = 'success';
      card.showValue = true;
      this.cards.forEach(card => {
        card.disabled = false;
      });
      this.updatePoints();
      this.gameMessage = `You win ${this.getPointsForLevel()} points.<br>Press start to play again.`;
      this.gameOver = true;
    } else {
      card.color = 'danger';
      card.showValue = true;
      this.gameOver = true;
      this.gameMessage = `You have failed.<br>Press start to play again.`;
    }

    this.cardsEnabled = false;
  }

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

  shuffleArray(array: number[]) {
    return array.sort(() => Math.random() - 0.5);
  }
}
