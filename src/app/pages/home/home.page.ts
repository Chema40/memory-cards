import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home', // Defines the component's custom HTML tag
  templateUrl: 'home.page.html', // Path to the component's HTML template
  styleUrls: ['home.page.scss'], // Path to the component's CSS styles
})
export class HomePage {
  // Variable to store the username, initially set to an empty string
  username: string = '';

  // Inject the Router service into the component to enable navigation
  constructor(private router: Router) {}

  // Method to handle the start of the game when the user clicks the "JOIN" button
  startGame() {
    // Check if the username is not empty after trimming leading/trailing spaces
    if (this.username.trim().length > 0) {
      // Navigate to the '/game' route and pass the username as a query parameter
      this.router.navigate(['/game'], { queryParams: { username: this.username } });
    } else {
      // Show an alert if the username field is empty or contains only spaces
      alert('Please enter a valid name.');
    }
  }
}
