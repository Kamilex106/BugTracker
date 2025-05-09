import { TestBed } from '@angular/core/testing';

import { BugAssignmentService } from './bug-assignment.service';

describe('BugAssignmentService', () => {
  let service: BugAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
