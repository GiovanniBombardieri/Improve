import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from '../../../auth/auth.service';
import { DialogContentComponent } from './dialog-content.component';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('DialogContentComponent', () => {
  let component: DialogContentComponent;
  let fixture: ComponentFixture<DialogContentComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['createUser']);

    await TestBed.configureTestingModule({
      declarations: [DialogContentComponent],
      imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatRadioModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DialogContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.addNewUserForm).toBeTruthy();
    expect(component.addNewUserForm.get('name')?.value).toBeNull();
    expect(component.addNewUserForm.get('email')?.value).toBeNull();
    expect(component.addNewUserForm.get('gender')?.value).toBeNull();
    expect(component.addNewUserForm.get('token')?.value).toBeNull();
  });

  it('should be invalid when form is empty', () => {
    const form = component.addNewUserForm;
    expect(form.valid).toBeFalsy();
  });

  it('should be valid when form is filled correctly', () => {
    const form = component.addNewUserForm;
    form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      gender: 'male',
      token: 'mock-token',
    });
    expect(form.valid).toBeTruthy();
  });

  it('should call createUser and interact with localStorage when form is valid', () => {
    const form = component.addNewUserForm;
    form.setValue({
      name: 'Test User',
      email: 'test@example.com',
      gender: 'male',
      token: 'mock-token',
    });

    const mockUserData = { token: 'mock-token' };
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify(mockUserData)
    );
    spyOn(localStorage, 'setItem');

    authServiceSpy.createUser.and.returnValue(of({}));

    const reloadSpy = spyOn(location, 'reload').and.callThrough();
    component.onAddUser(form);

    expect(authServiceSpy.createUser).toHaveBeenCalled();
    expect(authServiceSpy.createUser).toHaveBeenCalledWith(
      'mock-token',
      jasmine.objectContaining({
        email: 'test@example.com',
        gender: 'male',
        id: 1000100,
        name: 'Test User',
        status: 'active',
      })
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'currentUser',
      jasmine.any(String)
    );
    expect(location.reload).not.toHaveBeenCalled(); // Check if reload was not called
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should not call createUser when form is invalid', () => {
    const form = component.addNewUserForm;
    form.setValue({
      name: '',
      email: '',
      gender: '',
      token: '',
    });

    component.onAddUser(form);

    expect(authServiceSpy.createUser).not.toHaveBeenCalled();
  });
});
