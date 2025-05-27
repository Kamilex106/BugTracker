import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {
  private email: string | null = null;
  private id: string | null = null;
  private userRoles: string[] = [];

  private rolesSubject = new BehaviorSubject<string[]>([]);
  public roles$ = this.rolesSubject.asObservable();

  setUser(email: string, id: string, roles?: string[]) {
    this.email = email;
    this.id = id;
    this.userRoles = roles || [];
    this.rolesSubject.next(this.userRoles);
  }

  clearUser() {
    this.email = null;
    this.id = null;
    this.userRoles = [];
    this.rolesSubject.next([]);
  }

  getId(): string | null {
    return this.id;
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  getRoles(): string[] {
    return this.userRoles;
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }

  getEmail() {
    return this.email;
  }
}
