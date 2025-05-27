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

  bug_reports_paginated: BugReport[] = [];
  searchMode: boolean = false;

  constructor(
    private bugReportService: BugReportService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.bug_reports_paginated = [];
  }

  ngOnInit() {
    this.listBugReports();
  }


  listBugReports() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchBugReportsFiltered();
    }
    else {
      this.handleListBugReportsPaginatedFiltered();
    }
  }

  handleListBugReportsPaginatedFiltered() {
    this.bugReportService.getBugReportListPaginatedFiltered(0, 100).subscribe(
      (data: BugReport[]) => {
        this.bug_reports_paginated = data;
      },
      error => console.error("Error fetching filtered data:", error)
    );
  }

  handleSearchBugReportsFiltered() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;
    this.bugReportService.searchBugReportsFiltered(theKeyword).subscribe(
      (data: BugReport[]) => {
        this.bug_reports_paginated = data;
      },
      error => console.error("Error fetching filtered search data:", error)
    );
  }

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
          this.bug_reports_paginated = enhancedData;
        });
      }
    );
  }

  handleListBugReportsPaginated() {
    this.bugReportService.getBugReportListPaginated(0, 100).subscribe(
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
          this.bug_reports_paginated = enhancedData;
        });
      },
      error => console.error("Error fetching data:", error)
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
          this.bug_reports_paginated = enhancedData;
        });
      },
      error => console.error("Error fetching data:", error)
    );
  }

  showDetails(bugReportId?: number) {
    this.router.navigate(['/bugdetails', bugReportId]);
  }

  editBug(bugReportId?: number) {
    this.router.navigate(['/editbug', bugReportId]);
  }

  getPriorityClass(priority: string | undefined): string {
    if (!priority) return '';
    return `priority-${priority.toLowerCase()}`;
  }

  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    const statusLower = status.toLowerCase().replace(/\s+/g, '-');
    return `status-${statusLower}`;
  }

  doSearch(value: string) {
    console.log(`Searching for: ${value}`);
    if (value.trim()) {
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate(['/search', value.trim()]);
      });
    } else {
      // Jeśli puste, wróć do wszystkich bug reportów
      this.router.navigate(['/bugreports']);
    }
  }
}


















