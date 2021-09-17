import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestInfoDialogComponent } from './test-info-dialog.component';

describe('TestInfoDialogComponent', () => {
  let component: TestInfoDialogComponent;
  let fixture: ComponentFixture<TestInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestInfoDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
