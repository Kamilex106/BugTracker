import {Component, Inject, OnInit} from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  isAuthenticated: boolean = false;
  userEmail: string | null = null;
  userId: string | null = null;

  // Backend API base URL
  private apiUrl = 'http://localhost:8080'; // This should be your backend server URL

  constructor(
    public authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.authStateService.authState$.subscribe(authState => {
      this.isAuthenticated = authState.isAuthenticated ?? false;

      if (this.isAuthenticated) {
        this.getCurrentUser();
      } else {
        this.userEmail = null;
        this.userId = null;
      }
    });
  }

  private async getCurrentUser() {
    const accessToken = (await this.oktaAuth.getAccessToken()) as string;
    this.http.get<{email: string, id: string}>(`${this.apiUrl}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).subscribe({
      next: (response) => { this.userEmail = response.email; this.userId = response.id; },
      error: (err) => { console.error('Błąd pobierania danych użytkownika:', err); this.userEmail = null; }
    });
  }

  login() {
    this.oktaAuth.signInWithRedirect();
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
