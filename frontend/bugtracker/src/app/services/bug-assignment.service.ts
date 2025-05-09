import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BugAssignmentService {
  private apiUrl = 'http://localhost:8080/api/assignments';

  constructor(private http: HttpClient) { }

  // Wywołuje endpoint POST /api/assignments/assign do przypisania błędu użytkownikowi
  assignBugToUser(bugReportId: number, employeeId: number): Observable<any> {
    const url = `${this.apiUrl}/assign`;
    return this.http.post(url, { bugReportId, employeeId });
  }

  // Wywołuje endpoint GET /api/assignments/all do pobrania listy wszystkich przypisań
  getAllAssignments(): Observable<any[]> {
    const url = `${this.apiUrl}/all`;
    return this.http.get<any[]>(url);
  }

  // Wywołuje endpoint DELETE /api/assignments/{id} do usunięcia konkretnego przypisania
  deleteAssignment(assignmentId: number): Observable<any> {
    const url = `${this.apiUrl}/${assignmentId}`;
    return this.http.delete(url);
  }
}
