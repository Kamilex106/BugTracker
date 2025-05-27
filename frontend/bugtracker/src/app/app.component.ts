import {Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {RoleManagementService} from './services/role-management.service';
import { OKTA_AUTH, OktaAuthStateService } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { HttpClient } from '@angular/common/http';
import {CurrentUserService} from './services/current-user.service';
import { ThemeService, Theme } from './services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'bugtracker';
  userRole: string = 'guest'; // Domyślna rola przed zalogowaniem
  currentTheme: Theme = 'dark'; // Dodane dla theme
  private apiUrl = 'http://localhost:8080'; // Backend server URL

  // Dodane subscriptions dla cleanup
  private themeSubscription: Subscription = new Subscription();
  private authSubscription: Subscription = new Subscription();
  private roleSubscription: Subscription = new Subscription();

  constructor(
    private roleManagementService: RoleManagementService,
    public authStateService: OktaAuthStateService,
    @Inject(OKTA_AUTH) public oktaAuth: OktaAuth,
    private http: HttpClient,
    private currentUserService: CurrentUserService,
    private themeService: ThemeService // Dodane Theme Service
  ) {}

  ngOnInit() {
    // Subskrypcja na zmiany motywu - DODANE
    this.themeSubscription = this.themeService.theme$.subscribe(theme => {
      this.currentTheme = theme;
    });

    // Nasłuchiwanie na zmiany stanu autentykacji
    this.authSubscription = this.authStateService.authState$.subscribe(authState => {
      if (authState?.isAuthenticated) {
        this.getUserRoleFromOkta();
      } else {
        // Jeśli użytkownik nie jest zalogowany, ustawiamy domyślną rolę
        this.roleManagementService.setUserRole('guest');
      }
    });

    // Subskrypcja na zmiany roli użytkownika
    this.roleSubscription = this.roleManagementService.currentUserRole$.subscribe(role => {
      this.userRole = role;
    });

    const email = this.currentUserService.getEmail();
    const id = this.currentUserService.getId();
    console.log('Zalogowany użytkownik:', email, id);
  }

  // Dodane cleanup subscriptions
  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.authSubscription?.unsubscribe();
    this.roleSubscription?.unsubscribe();
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
