import { TestBed } from '@angular/core/testing';

import { BugStatusService } from './bug-status.service';

describe('BugStatusService', () => {
  let service: BugStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
