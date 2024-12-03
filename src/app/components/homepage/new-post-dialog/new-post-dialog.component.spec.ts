import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPostDialogComponent } from './new-user-dialog.component';

describe('NewUserDialogComponent', () => {
  let component: NewPostDialogComponent;
  let fixture: ComponentFixture<NewPostDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NewPostDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
