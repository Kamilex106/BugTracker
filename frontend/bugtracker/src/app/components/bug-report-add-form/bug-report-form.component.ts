import {Component, OnInit} from '@angular/core';
import {Category} from '../../common/category';
import {BugStatus} from '../../common/bug-status';
import {BugReport} from '../../common/bug-report';
import {BugReportService} from '../../services/bug-report.service';
import {CategoryService} from '../../services/category.service';
import {BugStatusService} from '../../services/bug-status.service';
import {ActivatedRoute} from '@angular/router';
import {NgForm} from '@angular/forms';

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

  submitSuccess = false;
  submitError = false;

  constructor(
    private bugReportService: BugReportService,
    private categoryService: CategoryService,
    private bugStatusService: BugStatusService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBugStatuses();
  }

  onSubmit(form: NgForm): void {
    this.submitSuccess = false;
    this.submitError = false;

    if (form.invalid) {
      this.submitError = true;
      return;
    }

    this.bugReportService.createBugReport(this.bugReport).subscribe({
      next: (res) => {
        this.submitSuccess = true;
        this.submitError = false;
        form.resetForm();
        // Reset bugReport object and set default status again
        this.bugReport = new BugReport();
        this.setDefaultStatus();
      },
      error: (err) => {
        console.error('Error:', err);
        this.submitError = true;
        this.submitSuccess = false;
      }
    });
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe(data => {
      this.categories = data;
    });
  }

  private loadBugStatuses(): void {
    this.bugStatusService.getBugStatuses().subscribe(data => {
      this.statuses = data;
      // Set default status after loading statuses
      this.setDefaultStatus();
    });
  }

  private setDefaultStatus(): void {
    // Find and set "Open" status as default
    const openStatus = this.statuses.find(status =>
      status.name?.toLowerCase() === 'open'
    );
    if (openStatus) {
      this.bugReport.actualStatus = openStatus;
    }
  }

}
