import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { DialogUserComponent } from './dialog-user.component';
import { AuthService } from '../../../auth/auth.service';

import { MatDialogModule } from '@angular/material/dialog';

describe('DialogUserComponent', () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      imports: [MatDialogModule],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpy },
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
