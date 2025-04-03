import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BugReportLog } from '../common/bug-report-log';
import {forkJoin, Observable, of, switchMap} from 'rxjs';
import { map } from 'rxjs/operators';
import {BugReport} from '../common/bug-report';
import {BugStatus} from '../common/bug-status';

@Injectable({
  providedIn: 'root'
})
export class BugReportLogService {

  private baseUrl = 'http://localhost:8080/bugReportLogs';

  constructor(private httpClient: HttpClient) { }

  getBugReportLogsList(): Observable<BugReportLog[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
      map(response => response._embedded.bugReportLogs)
    );
  }

  // searchBugReportLogs(theKeyword: string): Observable<BugReportLog[]> {
  //   // need to build URL based on thr keyword
  //   const searchURL = `${this.baseUrl}/search/findByCommentContaining?comment=${theKeyword}`;
  //   return this.getBugReportLogs(searchURL);
  // }

  private getBugReportLogs(searchURL: string): Observable<BugReportLog[]> {
    return this.httpClient
      .get<GetResponse>(searchURL)
      .pipe(map((response) => response._embedded.bugReportLogs));
  }

  // bug-report-log.service.ts
  getBugReportLogsById(id: number): Observable<BugReportLog> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<any>(url).pipe(
      switchMap(log => {
        const requests = {
          log: of(log),
          status: log._links?.bugStatus?.href
            ? this.httpClient.get<BugStatus>(log._links.bugStatus.href)
            : of(null),
          report: log._links?.bugReport?.href
            ? this.httpClient.get<BugReport>(log._links.bugReport.href)
            : of(null)
        };

        return forkJoin(requests).pipe(
          map(({log, status, report}) => ({
            ...log,
            bugStatus: status,
            bugReport: report
          }))
        );
      })
    );
  }

}

interface GetResponse {
  _embedded: {
    bugReportLogs: BugReportLog[];
  }
}
