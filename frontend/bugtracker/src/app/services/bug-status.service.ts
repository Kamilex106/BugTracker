import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BugStatus} from '../common/bug-status';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BugStatusService {
  private baseUrl = 'http://localhost:8080/bugStatuses';

  constructor(private httpClient: HttpClient) {}

  getBugStatuses(): Observable<BugStatus[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.bugStatuses)
    );
  }
}

interface GetResponse {
  _embedded: {
    bugStatuses: BugStatus[];
  };
}
