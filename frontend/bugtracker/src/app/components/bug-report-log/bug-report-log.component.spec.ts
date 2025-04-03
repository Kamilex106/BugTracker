import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportLogComponent } from './bug-report-log.component';

describe('BugReportLogComponent', () => {
  let component: BugReportLogComponent;
  let fixture: ComponentFixture<BugReportLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BugReportLogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugReportLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
