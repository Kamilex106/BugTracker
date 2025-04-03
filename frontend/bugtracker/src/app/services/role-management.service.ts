import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleManagementService {
  private currentUserRole = new BehaviorSubject<string>('guest');
  currentUserRole$ = this.currentUserRole.asObservable();

  constructor() { }

  setUserRole(role: string): void {
    this.currentUserRole.next(role);
  }

  getUserRole(): string {
    return this.currentUserRole.value;
  }
}
