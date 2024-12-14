import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs'; // Importa `of` per mockare metodi che restituiscono Observable

import { ContactsComponent } from './contacts.component';
import { AuthService } from '../../auth/auth.service';
import { UserServiceService } from '../../service/user-service.service';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authSpy: jasmine.SpyObj<AuthService>;
  let userSpy: jasmine.SpyObj<UserServiceService>;

  beforeEach(async () => {
    // Mock del localStorage
    spyOn(localStorage, 'getItem').and.returnValue(
      JSON.stringify({ token: 'mock-token' })
    );
    spyOn(localStorage, 'removeItem');

    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authSpy = jasmine.createSpyObj('AuthService', [
      'getUserList',
      'deleteUser',
    ]);
    userSpy = jasmine.createSpyObj('UserServiceService', ['detailedUser']);

    // Configura il metodo `getUserList` per restituire un Observable vuoto o con dati di esempio
    authSpy.getUserList.and.returnValue(of([])); // Restituisce un Observable con una lista vuota

    await TestBed.configureTestingModule({
      declarations: [ContactsComponent],
      providers: [
        provideHttpClient(),
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: UserServiceService, useValue: userSpy },
      ],
      imports: [
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatSelectModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user list', () => {
    const mockUsers = [
      {
        email: 'example@email.com',
        gender: 'female',
        id: 1,
        name: 'name',
        status: 'active',
      },
    ];

    authSpy.getUserList.and.returnValue(of(mockUsers));

    component.ngOnInit();
    fixture.detectChanges();

    expect(authSpy.getUserList).toHaveBeenCalledWith(1, 12, 'mock-token');
    expect(component.users).toEqual(mockUsers);
  });

  it('should delete a user when onDeleteUser is called', () => {
    const userId = 100100;
    // const mockResponse = { message: 'User deleted successfully' };
    authSpy.deleteUser.and.returnValue(
      of({ message: 'User deleted successfully' })
    );
    spyOn(component, 'reloadPage').and.callFake(() => {});

    component.onDeleteUser(userId);

    expect(authSpy.deleteUser).toHaveBeenCalledWith('mock-token', userId);
    expect(localStorage.removeItem).toHaveBeenCalledWith('currentUser');
    expect(component.reloadPage).toHaveBeenCalled();
  });
});
