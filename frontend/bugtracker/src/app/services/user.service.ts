import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/users/all';

  constructor(private httpClient: HttpClient) { }

  getUsersList(): Observable<User[]> {
    return this.httpClient.get<User[]>(this.baseUrl);
  }

  deleteUser(id: number): Observable<void> {
    return this.httpClient.delete<void>(`http://localhost:8080/users/${id}`);
  }

  updateUserStatus(userId: number, enabled: boolean) {
    return this.httpClient.patch(`${this.baseUrl}/${userId}/status`,
      { enabled });
  }

  getAdminUsers(): Observable<any[]> {
    return this.httpClient.get<any[]>('http://localhost:8080/users/admins');
  }

}
