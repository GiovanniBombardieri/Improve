import { ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { DialogUserComponent } from './dialog-user.component';
import { UserServiceService } from '../../../service/user-service.service';
import { AuthService } from '../../../auth/auth.service';

import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';

describe('DialogUserComponent', () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;
  let mockUserService: jasmine.SpyObj<UserServiceService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj(
      'UserServiceService',
      ['getDetailedUser'],
      {
        detailedUser: { id: 1, name: 'Test User' },
      }
    );

    mockAuthService = jasmine.createSpyObj('AuthService', [
      'deletePost',
      'getUserPosts',
      'getPostComment',
      'createPostComment',
      'deleteComment',
    ]);

    await TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      imports: [
        ReactiveFormsModule,
        MatDividerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        provideHttpClient(),
        { provide: UserServiceService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;

    component.user = {
      id: 1,
      name: 'Test User',
      email: 'prova@email.com',
      gender: 'male',
      status: 'active',
    };

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user and form on ngOnInit', () => {
    spyOn(component, 'onUserDetails');
    spyOn(component, 'checkUser');
    // localStorage.setItem(
    //   'currentUser',
    //   JSON.stringify({ id: 1, name: 'Current User' })
    // );

    component.ngOnInit();
    tick();

    expect(component.user).toEqual(mockUserService.detailedUser);
    expect(component.onUserDetails).toHaveBeenCalled();
    expect(component.checkUser).toHaveBeenCalled();
    expect(component.currentUserId).toBe(1000100);
    // expect(component.currentUserName).toBe('Current User');
    expect(component.addNewCommentForm).toBeDefined();
  });

  it('should call deletePost on authService with the correct parameters', () => {
    const postId = 123;
    mockAuthService.deletePost.and.returnValue(of({}));
    localStorage.setItem('userData', JSON.stringify({ token: 'test-token' }));

    component.onDeletePost(postId);

    expect(mockAuthService.deletePost).toHaveBeenCalledWith(
      'test-token',
      postId
    );
  });

  it('should call getUserPosts and populate posts in onUserDetails', () => {
    const mockPosts = [{ id: 1 }, { id: 2 }];
    mockAuthService.getUserPosts.and.returnValue(of(mockPosts));
    localStorage.setItem('userData', JSON.stringify({ token: 'test-token' }));

    component.onUserDetails();
    console.log('Posts:', component.posts);

    expect(mockAuthService.getUserPosts).toHaveBeenCalledWith(
      'test-token',
      component.user.id
    );
    expect(component.posts).toEqual(mockPosts);
  });

  it('should call createPostComment on authService in onAddComment', () => {
    const mockCommentForm = component.addNewCommentForm;
    const postId = 1;
    mockCommentForm.setValue({ commentBody: 'Test comment' });
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ email: 'test@test.com', name: 'Tester' })
    );
    localStorage.setItem('userData', JSON.stringify({ token: 'test-token' }));
    mockAuthService.createPostComment.and.returnValue(of({}));

    component.onAddComment(mockCommentForm, postId);

    expect(mockAuthService.createPostComment).toHaveBeenCalledWith(
      'test-token',
      postId,
      jasmine.objectContaining({
        post_id: postId,
        body: 'Test comment',
        email: 'test@test.com',
        name: 'Tester',
      })
    );
  });

  it('should call deleteComment on authService in onDeleteComment', () => {
    const commentId = 1;
    localStorage.setItem('userData', JSON.stringify({ token: 'test-token' }));
    mockAuthService.deleteComment.and.returnValue(of({}));

    component.onDeleteComment(commentId);

    expect(mockAuthService.deleteComment).toHaveBeenCalledWith(
      'test-token',
      commentId
    );
  });

  it('should set userExist to true if currentUser is in localStorage', () => {
    localStorage.setItem('currentUser', JSON.stringify({ id: 1000100 }));
    component.checkUser();
    expect(component.userExist).toBeTrue();
  });
});
