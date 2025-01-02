import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { NewPostDialogComponent } from './new-post-dialog.component';
import { AuthService } from '../../../auth/auth.service';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

describe('NewPostDialogComponent', () => {
  let component: NewPostDialogComponent;
  let fixture: ComponentFixture<NewPostDialogComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['createNewPost']);

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
      providers: [{ provide: AuthService, useValue: authServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(NewPostDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty values', () => {
    expect(component.addNewPost).toBeTruthy();
    expect(component.addNewPost.get('title')?.value).toBeNull();
    expect(component.addNewPost.get('body')?.value).toBeNull();
  });

  it('should check if user exists in localStorage and set userExist to true', () => {
    spyOn(localStorage, 'getItem').and.returnValue(
      '{"id": 1, "name": "Test User"}'
    );
    component.checkUser();
    expect(component.userExist).toBeTrue();
  });

  it('should not add post if user is not in localStorage', () => {
    spyOn(localStorage, 'getItem').and.returnValue(null);
    const form = component.addNewPost;
    form.setValue({ title: 'New Post', body: 'Post Body' });

    component.onAddPost(form);

    expect(authServiceSpy.createNewPost).not.toHaveBeenCalled();
  });

  it('should call createNewPost and reload the page when form is valid and user exists', () => {
    const form = component.addNewPost;
    form.setValue({ title: 'New Post', body: 'Post Body' });

    const mockUser = { id: 1, token: 'mock-token' };
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentUser') {
        return JSON.stringify({ id: 1 });
      } else if (key === 'userData') {
        return JSON.stringify(mockUser);
      }
      return null;
    });

    const reloadSpy = spyOn(location, 'reload').and.callThrough();
    authServiceSpy.createNewPost.and.returnValue(of({}));

    component.onAddPost(form);

    expect(authServiceSpy.createNewPost).toHaveBeenCalledWith(
      'mock-token',
      1,
      jasmine.objectContaining({
        title: 'New Post',
        body: 'Post Body',
        id: 1000001,
        user_id: 1,
      })
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'currentUser',
      jasmine.any(String)
    );
    expect(reloadSpy).toHaveBeenCalled();
  });

  it('should not call createNewPost if token is not present in localStorage', () => {
    const form = component.addNewPost;
    form.setValue({ title: 'New Post', body: 'Post Body' });

    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'currentUser') {
        return JSON.stringify({ id: 1 });
      } else if (key === 'userData') {
        return JSON.stringify({}); // Nessun token
      }
      return null;
    });

    component.onAddPost(form);

    expect(authServiceSpy.createNewPost).not.toHaveBeenCalled();
  });
});
