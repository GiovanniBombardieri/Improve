import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { AuthService } from '../../auth/auth.service';

import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Mock del router
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpy },
        AuthService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Inizio singoli test (IT)

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inizialize loginFormControl', () => {
    expect(component.loginFormControl).toBeDefined();
    expect(component.loginFormControl.get('tokenControl')).toBeDefined();
    expect(
      component.loginFormControl.get('tokenControl')?.validator
    ).toBeTruthy();
  });

  it('should mark form as invalid if tokenControl is empty', () => {
    component.loginFormControl.get('tokenControl')?.setValue('');
    expect(component.loginFormControl.valid).toBeFalse();
  });

  it('should navigate to /contacts on successful login', () => {
    component.loginFormControl.get('tokenControl')?.setValue('valid-token');
    component.onLogin();
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');

    expect(userData.token).toBe('valid-token');

    expect(routerSpy.navigate).toHaveBeenCalledWith(['/contacts']);
  });

  it('should not navigate if form is invalid', () => {
    component.loginFormControl.get('tokenControl')?.setValue('');
    component.onLogin();

    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});
