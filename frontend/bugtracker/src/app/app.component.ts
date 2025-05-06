import {Component, Inject, OnInit} from '@angular/core';
import {RoleManagementService} from './services/role-management.service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'bugtracker';
  userRole: string = 'guest'; // Domyślna rola przed zalogowaniem
  private apiUrl = 'http://localhost:8080'; // Backend server URL

  constructor(
    private roleManagementService: RoleManagementService,
    public authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private http: HttpClient
  ) {}

  ngOnInit() {
    // Nasłuchiwanie na zmiany stanu autentykacji
    this.authStateService.authState$.subscribe(authState => {
      if (authState?.isAuthenticated) {
        this.getUserRoleFromOkta();
      } else {
        // Jeśli użytkownik nie jest zalogowany, ustawiamy domyślną rolę
        this.roleManagementService.setUserRole('guest');
      }
    });

    // Subskrypcja na zmiany roli użytkownika
    this.roleManagementService.currentUserRole$.subscribe(role => {
      this.userRole = role;
    });
  }

  private async getUserRoleFromOkta() {
    try {
      // Pobieramy informacje o użytkowniku bezpośrednio przez metodę getUser() z Okta SDK
      const userInfo = await this.oktaAuth.getUser();

      // Sprawdzamy czy mamy informacje o grupach
      if (userInfo && userInfo['groups'] && Array.isArray(userInfo['groups'])) {
        // Na podstawie struktury którą pokazałeś - grupy są bezpośrednio dostępne w obiekcie użytkownika
        if (userInfo['groups'].includes('ROLE_ADMIN')) {
          this.roleManagementService.setUserRole('admin');
          return;
        } else if (userInfo['groups'].includes('ROLE_USER')) {
          this.roleManagementService.setUserRole('user');
          return;
        }
      }

      // Jeśli nie znaleziono odpowiednich grup, ustawiamy domyślną rolę "user"
      this.roleManagementService.setUserRole('user');

    } catch (error) {
      console.error('Błąd podczas pobierania informacji o użytkowniku z Okta:', error);
      this.roleManagementService.setUserRole('guest');
    }
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole);
  }
}
