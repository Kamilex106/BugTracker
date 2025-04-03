import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugReportFormComponent } from './bug-report-form.component';

describe('BugReportFormComponent', () => {
  let component: BugReportFormComponent;
  let fixture: ComponentFixture<BugReportFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BugReportFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
