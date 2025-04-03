import {Component, OnInit} from '@angular/core';
import {RoleManagementService} from './services/role-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'bugtracker';
  userRole: string = 'admin';

  constructor(private roleManagementService: RoleManagementService) {
  }

  ngOnInit() {
    this.roleManagementService.setUserRole('admin');

    this.roleManagementService.currentUserRole$.subscribe(role => {
      this.userRole = role;
    });

    // TODO
    // np. roleManagementService.setUserRole('admin'); // mozna ustawic na podstawie tokenu JWT
  }

  hasRole(...roles: string[]): boolean {
    return roles.includes(this.userRole);
  }
}
