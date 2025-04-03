import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { BugReport } from '../common/bug-report';
import {Observable, tap} from 'rxjs';
import { map } from 'rxjs/operators';
import {Category} from '../common/category';
import {BugStatus} from '../common/bug-status';

@Injectable({
  providedIn: 'root'
})
export class BugReportService {

  private baseUrl = 'http://localhost:8080/bugReports';

  constructor(private httpClient: HttpClient) { }


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
    return this.httpClient.get<GetResponse>(this.baseUrl).pipe(
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
}

interface GetResponse {
  _embedded: {
    bugReports: BugReport[];  // Poprawiona nazwa klucza
  }
}
