// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from './services/auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  title = 'CiciDolap - İkinci El Platformu';
  isLoggedIn = false;
  currentUser: any = null;
  isAdmin = false;

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.auth.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.currentUser = user;
      this.isAdmin = this.auth.isAdmin();
      console.log('Auth State:', { user, isLoggedIn: this.isLoggedIn, isAdmin: this.isAdmin });
    });
  }

  logout() {
    this.auth.logout();
  }
}