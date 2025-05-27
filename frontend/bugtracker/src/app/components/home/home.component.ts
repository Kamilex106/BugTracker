import {Component, Inject, OnInit} from '@angular/core';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpClient } from '@angular/common/http';
import {CurrentUserService} from '../../services/current-user.service';

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
  isAdmin: boolean = false;
  userStats = {
    totalBugs: 0,
    closedBugs: 0,
    openBugs: 0,
    inProgressBugs: 0
  };
  adminStats = {
    totalUsers: 0,
    totalBugs: 0,
    pendingBugs: 0,
    todayBugs: 0
  };

  private apiUrl = 'http://localhost:8080';

  constructor(
    public authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private http: HttpClient,
    private currentUserService: CurrentUserService
  ) {}

  ngOnInit() {
    this.authStateService.authState$.subscribe(authState => {
      this.isAuthenticated = authState.isAuthenticated ?? false;

      if (this.isAuthenticated) {
        this.getCurrentUser();
      } else {
        this.userEmail = null;
        this.userId = null;
        this.isAdmin = false;
        this.currentUserService.clearUser(); // DODAJ czyszczenie
      }
    });
  }

  private async getCurrentUser() {
    const accessToken = (await this.oktaAuth.getAccessToken()) as string;
    this.http.get<{
      email: string,
      id: string,
      isAdmin: boolean, // Użyj tego pola
      username: string
    }>(`${this.apiUrl}/user/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).subscribe({
      next: (response) => {
        this.userEmail = response.email;
        this.userId = response.id;

        // Użyj pola isAdmin z backendu
        this.isAdmin = response.isAdmin || false;

        // Stwórz tablicę ról na podstawie isAdmin
        const roles = response.isAdmin ? ['ROLE_ADMIN', 'ROLE_USER'] : ['ROLE_USER'];

        // Przekaż role do CurrentUserService
        this.currentUserService.setUser(response.email, response.id, roles);

        console.log('User response:', response);
        console.log('Is admin from backend:', response.isAdmin);
        console.log('Roles created:', roles);

        // Pobierz statystyki
        this.loadUserStats();
      },
      error: (err) => {
        console.error('Błąd pobierania danych użytkownika:', err);
        this.userEmail = null;
      }
    });
  }

  private async loadUserStats() {
    const accessToken = (await this.oktaAuth.getAccessToken()) as string;

    if (this.isAdmin) {
      // Statystyki dla admina
      this.http.get<any>(`${this.apiUrl}/api/admin/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).subscribe({
        next: (stats) => {
          this.adminStats = stats;
        },
        error: (err) => console.error('Error loading admin stats:', err)
      });
    } else {
      // Statystyki dla użytkownika
      this.http.get<any>(`${this.apiUrl}/api/user/stats`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      }).subscribe({
        next: (stats) => {
          this.userStats = stats;
        },
        error: (err) => console.error('Error loading user stats:', err)
      });
    }
  }

  login() {
    this.oktaAuth.signInWithRedirect();
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
