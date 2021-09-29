import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultInfoDialogComponent } from './result-info-dialog.component';

describe('ResultInfoDialogComponent', () => {
  let component: ResultInfoDialogComponent;
  let fixture: ComponentFixture<ResultInfoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResultInfoDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
