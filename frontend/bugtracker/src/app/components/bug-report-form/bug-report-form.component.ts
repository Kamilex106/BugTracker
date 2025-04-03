import {Component, OnInit} from '@angular/core';
import {Category} from '../../common/category';
import {BugStatus} from '../../common/bug-status';
import {BugReport} from '../../common/bug-report';
import {BugReportService} from '../../services/bug-report.service';
import {CategoryService} from '../../services/category.service';
import {BugStatusService} from '../../services/bug-status.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-bug-report-form',
  standalone: false,
  templateUrl: './bug-report-form.component.html',
  styleUrl: './bug-report-form.component.css'
})
export class BugReportFormComponent implements OnInit {
  bugReport: BugReport = new BugReport();
  categories: Category[] = [];
  statuses: BugStatus[] = [];

  constructor(
    private bugReportService: BugReportService,
    private categoryService: CategoryService,
    private bugStatusService: BugStatusService) { }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBugStatuses();
  }

  onSubmit() {
    this.bugReportService.createBugReport(this.bugReport).subscribe({
      next: (res) => console.log('Report created:', res),
      error: (err) => console.error('Error:', err)
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  loadBugStatuses(): void {
    this.bugStatusService.getBugStatuses().subscribe(data => {
      this.statuses = data;
    });
  }
}
