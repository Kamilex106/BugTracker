import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BugAssignmentService } from '../../services/bug-assignment.service';
import { BugReportService } from '../../services/bug-report.service';
import { UserService } from '../../services/user.service';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-bug-assignment',
  standalone: false,
  templateUrl: './bug-assignment.component.html',
  styleUrls: ['./bug-assignment.component.css']
})
export class BugAssignmentComponent implements OnInit {
  assignForm!: FormGroup;
  bugReports: any[] = [];
  filteredBugReports: any[] = [];
  employees: any[] = [];
  filteredEmployees: any[] = [];
  assignments: any[] = [];

  // Zakładamy istnienie serwisów BugReportService i UserService
  // dostarczających listy zgłoszeń i użytkowników.
  constructor(
    private fb: FormBuilder,
    private bugAssignmentService: BugAssignmentService,
    private bugReportService: BugReportService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // Inicjalizacja formularza przypisania (Reactive Forms)
    this.assignForm = this.fb.group({
      bugReportId: [null, Validators.required],
      employeeId: [null, Validators.required]
    });

    this.loadInitialData();

    this.assignForm.get('bugReportId')?.valueChanges.subscribe(value => {
      console.log('bugReportId changed to:', value);
      console.log('filteredBugReports:', this.filteredBugReports);
    });
  }

  private loadInitialData(): void {
    // Użyj forkJoin aby poczekać na wszystkie dane
    forkJoin({
      reports: this.bugReportService.getBugReportListPaginated(0, 100),
      users: this.userService.getAdminUsers(),
      assignments: this.bugAssignmentService.getAllAssignments()
    }).subscribe({
      next: ({ reports, users, assignments }) => {
        this.bugReports = reports;
        this.filteredBugReports = [...reports];
        this.employees = users;
        this.filteredEmployees = [...users];
        this.assignments = assignments;

        // Teraz możesz bezpiecznie ustawić listenery
        this.setupFormListeners();
      },
      error: (err) => {
        console.error('Błąd przy ładowaniu danych:', err);
      }
    });
  }

  private setupFormListeners(): void {
    this.assignForm.get('bugReportId')?.valueChanges.subscribe(selectedBugId => {
      this.updateFilteredEmployees(selectedBugId);
    });

    this.assignForm.get('employeeId')?.valueChanges.subscribe(selectedEmployeeId => {
      this.updateFilteredBugReports(selectedEmployeeId);
    });
  }

  // Pomocnicza metoda do pobrania wszystkich przypisań z serwisu
  loadAssignments(): void {
    this.bugAssignmentService.getAllAssignments().subscribe(assignments => {
      this.assignments = assignments;

      this.updateFilteredEmployees(this.assignForm.get('bugReportId')?.value);
      this.updateFilteredBugReports(this.assignForm.get('employeeId')?.value);
    });
  }

  // Obsługa złożenia formularza przypisania
  onAssign(): void {
    if (!this.assignForm.valid) return;

    const { bugReportId, employeeId } = this.assignForm.value;

    this.bugAssignmentService.assignBugToUser(bugReportId, employeeId).subscribe({
      next: response => {
        this.loadAssignments();
        // Resetuj formularz do wartości początkowych
        this.assignForm.reset({
          bugReportId: null,
          employeeId: null
        });
        // Przywróć pełne listy po resecie
        this.filteredBugReports = [...this.bugReports];
        this.filteredEmployees = [...this.employees];
      },
      error: err => {
        console.error('Błąd przy przypisywaniu zgłoszenia:', err);
      }
    });
  }


  // Usunięcie przypisania (DELETE /api/assignments/{id})
  onDelete(assignmentId: number): void {
    this.bugAssignmentService.deleteAssignment(assignmentId).subscribe({
      next: () => {
        // Po pomyślnym usunięciu odśwież listę przypisań
        this.loadAssignments();
      },
      error: err => {
        console.error('Błąd przy usuwaniu przypisania:', err);
      }
    });
  }

  private updateFilteredEmployees(selectedBugId: number) {
    if (!selectedBugId) {
      this.filteredEmployees = [...this.employees];
      return;
    }

    const assignedUserIds = this.assignments
      .filter(a => a.bugReport?.id === +selectedBugId)
      .map(a => a.employee?.id);

    this.filteredEmployees = this.employees.filter(
      u => !assignedUserIds.includes(u.id)
    );
  }

  private updateFilteredBugReports(selectedEmployeeId: number) {
    if (!selectedEmployeeId) {
      this.filteredBugReports = [...this.bugReports];
      return;
    }

    const assignedBugIds = this.assignments
      .filter(a => a.employee?.id === +selectedEmployeeId)   //
      .map(a => a.bugReport?.id);

    this.filteredBugReports = this.bugReports.filter(
      b => !assignedBugIds.includes(b.id)
    );
  }
}
