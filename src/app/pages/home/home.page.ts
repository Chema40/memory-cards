import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  username: string = '';

  constructor(private router: Router) {}

  startGame() {
    if (this.username.trim().length > 0) {
      this.router.navigate(['/game'], { queryParams: { username: this.username } });
    } else {
      alert('Please enter a valid name.');
    }
  }
}