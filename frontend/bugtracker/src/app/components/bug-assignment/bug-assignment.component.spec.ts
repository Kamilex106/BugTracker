import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BugAssignmentComponent } from './bug-assignment.component';

describe('BugAssignmentComponent', () => {
  let component: BugAssignmentComponent;
  let fixture: ComponentFixture<BugAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BugAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BugAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
