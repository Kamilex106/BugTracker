// bug-assignment.ts
export interface BugAssignment {
  id?: number;
  bugReport: {
    id: number;
    title: string;
  };
  employee: {
    id: number;
    username: string;
  };
}

export interface AssignmentRequest {
  bugReportId: number;
  employeeId: number;
}
