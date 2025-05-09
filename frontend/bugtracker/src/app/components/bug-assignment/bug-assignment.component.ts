import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BugAssignmentService } from '../../services/bug-assignment.service';
import { BugReportService } from '../../services/bug-report.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-bug-assignment',
  standalone: false,
  templateUrl: './bug-assignment.component.html',
  styleUrls: ['./bug-assignment.component.css']
})
export class BugAssignmentComponent implements OnInit {
  assignForm!: FormGroup;
  bugReports: any[] = [];
  employees: any[] = [];
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
      bugReportId: ['', Validators.required],
      employeeId: ['', Validators.required]
    });
    // Pobranie listy wszystkich zgłoszeń i użytkowników do wyboru w formularzu
    this.bugReportService.getBugReportList().subscribe(reports => {
      this.bugReports = reports;
    });
    this.userService.getUsersList().subscribe(users => {
      this.employees = users;
    });
    // Pobranie istniejących przypisań do wyświetlenia w tabeli
    this.loadAssignments();
  }

  // Pomocnicza metoda do pobrania wszystkich przypisań z serwisu
  loadAssignments(): void {
    this.bugAssignmentService.getAllAssignments().subscribe(assignments => {
      this.assignments = assignments;
    });
  }

  // Obsługa złożenia formularza przypisania
  onAssign(): void {
    if (this.assignForm.valid) {
      const { bugReportId, employeeId } = this.assignForm.value;
      // Wywołanie serwisu do przypisania błędu użytkownikowi (POST /api/assignments/assign)
      this.bugAssignmentService.assignBugToUser(bugReportId, employeeId).subscribe({
        next: response => {
          // Po pomyślnym przypisaniu odśwież listę przypisań i wyczyść formularz
          this.loadAssignments();
          this.assignForm.reset();
        },
        error: err => {
          console.error('Błąd przy przypisywaniu zgłoszenia:', err);
        }
      });
    }
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
}
