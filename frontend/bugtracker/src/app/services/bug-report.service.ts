import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BugReport } from '../common/bug-report';
import {forkJoin, Observable, of, switchMap, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import {Category} from '../common/category';
import {BugStatus} from '../common/bug-status';
import {BugReportLog} from '../common/bug-report-log';

@Injectable({
  providedIn: 'root'
})
export class BugReportService {

  private baseUrl = 'http://localhost:8080/bugReports';

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }),
    withCredentials: true
  };

  getBugReportList(): Observable<BugReport[]> {
    // return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
    //   map(response => response._embedded.bugReports.map(bug =>
    //     new BugReport(
    //       bug.id,
    //       bug.title,
    //       bug.description,
    //       bug.priority,
    //       bug.createdAt,
    //       undefined, // category będzie dodane później
    //       undefined, // status będzie dodany później
    //       bug.user,
    //       bug._links
    //     )
    //   ))
    // );
    return this.httpClient.get<GetResponse>(this.baseUrl, this.httpOptions).pipe(
      map(response => response._embedded.bugReports)
    );
  }

  // getBugReportList(): Observable<BugReport[]> {
  //   return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
  //     map(response => {
  //       const bugReports = response._embedded.bugReports;
  //       return bugReports.map(bug => ({
  //         ...bug,
  //         category: bug.category || new Category(),
  //         actualStatus: bug.actualStatus || new BugStatus()
  //       }));
  //     })
  //   );


  // }

  searchBugReports(theKeyword: string): Observable<BugReport[]> {
    // need to build URL based on thr keyword
    // const searchURL = `${this.baseUrl}/search/findByTitleContaining?title=${theKeyword}`;
    // return this.httpClient.get<GetResponse>(searchURL).pipe(
    //   map(response => response._embedded.bugReports.map(bug =>
    //     new BugReport(
    //       bug.id,
    //       bug.title,
    //       bug.description,
    //       bug.priority,
    //       bug.createdAt,
    //       undefined,
    //       undefined,
    //       bug.user,
    //       bug._links
    //     )
    //   ))
    // );
    const searchURL = `${this.baseUrl}/search/findByTitleContaining?title=${theKeyword}`;
    return this.getBugReport(searchURL);
  }

  getBugReport(searchURL: string): Observable<BugReport[]> {
    return this.httpClient
      .get<GetResponse>(searchURL)
      .pipe(map((response) => response._embedded.bugReports));
  }

  private baseUrl2 = 'http://localhost:8080/bugreports';
  createBugReport(report: BugReport): Observable<any> {
    return this.httpClient.post(this.baseUrl2, report);
  }

  getCategory(categoryUrl: string): Observable<Category> {
    // console.log("Pobieram kategorię z:", categoryUrl);
    return this.httpClient.get<Category>(categoryUrl);
  }

  getStatus(statusUrl: string): Observable<BugStatus> {
    // console.log("Pobieram status z:", statusUrl);
    return this.httpClient.get<BugStatus>(statusUrl);
  }

  getBugReportById(id: number): Observable<BugReportLog> {
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
    bugReports: BugReport[];  // Poprawiona nazwa klucza
  }
}
