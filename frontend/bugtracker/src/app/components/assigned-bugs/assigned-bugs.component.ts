import { Component, OnInit } from '@angular/core';
import { BugReportService } from '../../services/bug-report.service';
import { BugReport } from '../../common/bug-report';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Category } from '../../common/category';
import { BugStatus } from '../../common/bug-status';

@Component({
  selector: 'app-bug-report',
  templateUrl: './assigned-bugs.component.html',
  styleUrl: './assigned-bugs.component.css',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AssignedBugsComponent implements OnInit {

  bug_reports_paginated: BugReport[] = [];

  constructor(
    private bugReportService: BugReportService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadAssignedBugReports();
  }

  loadAssignedBugReports() {
    this.bugReportService.getAssignedBugReports().subscribe(
      (baseData: BugReport[]) => {
        // Optionally enhance with categories/statuses
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
      error => console.error("Error fetching assigned bug reports:", error)
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
}
