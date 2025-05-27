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
  private apiUrl = 'http://localhost:8080/api/bugreports';

  constructor(private httpClient: HttpClient) { }

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }),
    withCredentials: true
  };

  getBugReportListFiltered(): Observable<BugReport[]> {
    return this.httpClient.get<BugReport[]>(this.apiUrl);
  }

  getBugReportListPaginatedFiltered(page: number = 0, size: number = 100): Observable<BugReport[]> {
    const url = `${this.apiUrl}/paginated?page=${page}&size=${size}`;
    return this.httpClient.get<any>(url).pipe(
      map(response => response.content || response) // Obsługa Page<T> lub zwykłej listy
    );
  }

  searchBugReportsFiltered(keyword: string): Observable<BugReport[]> {
    const url = `${this.apiUrl}/search?keyword=${keyword}`;
    return this.httpClient.get<BugReport[]>(url);
  }

  // dla select np. /bugAssignments
  getBugReportList(): Observable<BugReport[]> {
    return this.httpClient.get<GetResponse>(this.baseUrl, this.httpOptions).pipe(
      map(response => response._embedded.bugReports)
    );
  }

  // dla calego wyswietlania np. /bugReports
  getBugReportListPaginated(page: number = 0, size: number = 20): Observable<BugReport[]> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.httpClient.get<GetResponse>(url, this.httpOptions).pipe(
      map(response => response._embedded.bugReports)
    );
  }

  getAssignedBugReports(): Observable<BugReport[]> {
    return this.httpClient.get<BugReport[]>(`http://localhost:8080/api/bugreports/assigned`, this.httpOptions);
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

  // bug-report.service.ts
  getBugReportById(id: number): Observable<BugReport> {
    const url = `${this.baseUrl}/${id}`;
    return this.httpClient.get<any>(url).pipe(
      switchMap(bugReport => {
        const requests = {
          bugReport: of(bugReport),
          category: bugReport._links?.category?.href
            ? this.httpClient.get<Category>(bugReport._links.category.href)
            : of(null),
          actualStatus: bugReport._links?.actualStatus?.href
            ? this.httpClient.get<BugStatus>(bugReport._links.actualStatus.href)
            : of(null)
        };

        return forkJoin(requests).pipe(
          map(({ bugReport, category, actualStatus }) => ({
            ...bugReport,
            category: category || new Category(),
            actualStatus: actualStatus || new BugStatus()
          }))
        );
      })
    );
  }


  // W bug-report.service.ts
  // W bug-report.service.ts
  // updateBugReportStatus(bugReportId: number, status: string): Observable<BugReport> {
  //   return this.httpClient.put<BugReport>(`${this.baseUrl}/${bugReportId}/actualStatus`, { status });
  // }
  updateBugReportStatus(bugReportId: number, status: string): Observable<BugReport> {
    return this.httpClient.put<BugReport>(`${this.baseUrl2}/${bugReportId}/status`, { status });
  }



  addCommentWithStatus(payload: {
    userId: number,
    bugReportId: number,
    comment: string,
    newStatus?: string | null
  }): Observable<any> {
    return this.httpClient.post<any>(
      `http://localhost:8080/bugreports/${payload.bugReportId}/comments-with-status`,
      payload
    );
  }

}

interface GetResponse {
  _embedded: {
    bugReports: BugReport[];  // Poprawiona nazwa klucza
  }
}
