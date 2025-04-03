import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BugReportService} from '../../services/bug-report.service';
import {BugReport} from '../../common/bug-report';
import {ActivatedRoute, Router} from '@angular/router';
import {debounceTime, forkJoin, of} from 'rxjs';
import {map} from 'rxjs/operators';
import {Category} from '../../common/category';
import {BugStatus} from '../../common/bug-status';

@Component({
  selector: 'app-bug-report',
  standalone: false,
  templateUrl: './bug-report.component.html',
  styleUrl: './bug-report.component.css',
})
export class BugReportComponent implements OnInit {

  bug_reports: BugReport[] = [];
  searchMode: boolean = false;

  constructor(
    private bugReportService: BugReportService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.listBugReports();
  }


  listBugReports() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchBugReports();
    }
    else {
      this.handleListBugReports();
    }
  }


  // handleSearchBugReports() {
  //   const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
  //
  //   // now search for the bug reports using keyword
  //   this.bugReportService.searchBugReports(theKeyword).subscribe(
  //     data => {
  //       this.bug_reports = data;
  //     }
  //   )
  // }
  //
  // handleListBugReports() {
  //   // now get the bug reports for the given category id
  //   this.bugReportService.getBugReportList().subscribe(
  //     data => {
  //       this.bug_reports = data;
  //     }
  //   )
  // }

  handleSearchBugReports() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.bugReportService.searchBugReports(theKeyword).subscribe(
      (baseData: BugReport[]) => {
        const requests = baseData.map(bug => {
          const category$ = bug._links?.category?.href
            ? this.bugReportService.getCategory(bug._links.category.href)
            : of(null);

          const status$ = bug._links?.actualStatus?.href
            ? this.bugReportService.getStatus(bug._links.actualStatus.href)
            : of(null);

          return forkJoin([category$, status$]).pipe(
            map(([category, status]) => ({
              ...bug,
              category: category || new Category(),
              actualStatus: status || new BugStatus()
            }))
          );
        });

        forkJoin(requests).subscribe(enhancedData => {
          this.bug_reports = enhancedData;
        });
      }
    );
  }

  handleListBugReports() {
    this.bugReportService.getBugReportList().subscribe(
      (baseData: BugReport[]) => {
        const requests = baseData.map(bug => {
          const category$ = bug._links?.category?.href
            ? this.bugReportService.getCategory(bug._links.category.href)
            : of(null);

          const status$ = bug._links?.actualStatus?.href
            ? this.bugReportService.getStatus(bug._links.actualStatus.href)
            : of(null);

          return forkJoin([category$, status$]).pipe(
            map(([category, status]) => ({
              ...bug,
              category: category || new Category(),
              actualStatus: status || new BugStatus()
            }))
          );
        });

        forkJoin(requests).subscribe(enhancedData => {
          this.bug_reports = enhancedData;
        });
      },
      error => console.error("Błąd pobierania danych:", error)
    );
  }

  showDetails(bugReportId?: number) {
  this.router.navigate(['/bugdetails', bugReportId]);
}

  editBug(bugReportId?: number) {
    this.router.navigate(['/editbug', bugReportId]);
  }
}
