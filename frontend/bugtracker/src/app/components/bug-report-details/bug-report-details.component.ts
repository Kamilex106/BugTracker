import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {BugReportLogService} from '../../services/bug-report-log.service';
import {BugReportLog} from '../../common/bug-report-log';

@Component({
  selector: 'app-bug-report-details',
  standalone: false,
  templateUrl: './bug-report-details.component.html',
  styleUrl: './bug-report-details.component.css'
})
export class BugReportDetailsComponent implements OnInit {
  bugReportLog?: BugReportLog;
  constructor(
    private route: ActivatedRoute,
    private bugReportLogService: BugReportLogService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!isNaN(id)) {
      this.loadBugReportLog(id);
    }
  }

  loadBugReportLog(id: number): void {
    this.bugReportLogService.getBugReportLogsById(id).subscribe({
      next: (data) => {
        this.bugReportLog = data;
      },
      error: (err) => {
        console.error('Błąd podczas pobierania zgłoszenia:', err);
      }
    });
  }
}
