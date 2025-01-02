import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { NewPostDialogComponent } from './new-user-dialog.component';
import { AuthService } from '../../../auth/auth.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('NewUserDialogComponent', () => {
  let component: NewPostDialogComponent;
  let fixture: ComponentFixture<NewPostDialogComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [NewPostDialogComponent],
      imports: [
        ReactiveFormsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
        MatButtonModule,
      ],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpy },
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
