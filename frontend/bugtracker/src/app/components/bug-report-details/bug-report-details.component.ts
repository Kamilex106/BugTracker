import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BugReportService} from '../../services/bug-report.service';
import {BugReport} from '../../common/bug-report';

@Component({
  selector: 'app-bug-report-details',
  standalone: false,
  templateUrl: './bug-report-details.component.html',
  styleUrl: './bug-report-details.component.css'
})
export class BugReportDetailsComponent implements OnInit {
  bugReport?: BugReport;
  constructor(
    private route: ActivatedRoute,
    private bugReportService: BugReportService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadBugReport(id);
    }
  }

  loadBugReport(id: number): void {
    this.bugReportService.getBugReportById(id).subscribe({
      next: (data) => {
        this.bugReport = data;
      },
      error: (err) => {
        console.error('Error fetching report:', err);
      }
    });
  }
}
