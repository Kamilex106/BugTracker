import { TestBed } from '@angular/core/testing';

import { BugReportLogService } from './bug-report-log.service';

describe('BugReportLogService', () => {
  let service: BugReportLogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BugReportLogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
