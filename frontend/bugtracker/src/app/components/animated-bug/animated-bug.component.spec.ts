import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedBugComponent } from './animated-bug.component';

describe('AnimatedBugComponent', () => {
  let component: AnimatedBugComponent;
  let fixture: ComponentFixture<AnimatedBugComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimatedBugComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimatedBugComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
