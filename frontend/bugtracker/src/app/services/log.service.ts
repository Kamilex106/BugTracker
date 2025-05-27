import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LogEntry } from '../common/log-entry';

@Injectable({
  providedIn: 'root'
})
export class LogService {
  private apiUrl = 'http://localhost:8080/api/logs';

  constructor(private http: HttpClient) { }

  getLogsByBugReportId(bugReportId: number): Observable<LogEntry[]> {
    return this.http.get<LogEntry[]>(`${this.apiUrl}/${bugReportId}`);
  }
}
