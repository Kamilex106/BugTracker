// comment.ts.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../common/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private apiUrl = 'http://localhost:8080/api/comments';

  constructor(private http: HttpClient) {}

  getCommentsByBugReportId(bugReportId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/${bugReportId}`);
  }

  addComment(payload: {
    comment: string,
    bugReport: { id: number },
    user: { id: number }
  }): Observable<Comment> {
    return this.http.post<Comment>(this.apiUrl, payload);
  }
}
