import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { DialogUserComponent } from './dialog-user.component';
import { AuthService } from '../../../auth/auth.service';
import { UserServiceService } from '../../../service/user-service.service';

import { MatDialogModule } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';

describe('DialogUserComponent', () => {
  let component: DialogUserComponent;
  let fixture: ComponentFixture<DialogUserComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserServiceService>;

  beforeEach(async () => {
    mockUserService = jasmine.createSpyObj('UserServiceService', [
      'detailedUser',
    ]);
    mockAuthService = jasmine.createSpyObj('AuthService', [
      'deletePost',
      'getUserPOsts',
      'getPostComment',
      'createPostComment',
      'deleteComment',
    ]);

    await TestBed.configureTestingModule({
      declarations: [DialogUserComponent],
      imports: [MatDialogModule, ReactiveFormsModule],
      providers: [
        { provide: UserServiceService, useValue: mockUserService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUserComponent);
    component = fixture.componentInstance;

    mockUserService.detailedUser = {
      email: 'prova@email.com',
      gender: 'female',
      id: 1,
      name: 'MockUser',
      status: 'Active',
    };

    spyOn(localStorage, 'getItem').and.callFake((key: string): any => {
      if (key === 'currentUser') {
        return JSON.stringify({
          id: 1000100,
          name: 'Current User',
          email: 'test@example.com',
          gender: 'female',
          status: 'active',
        });
      }
      return null;
    });

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user details on ngOnInit', () => {
    spyOn(component, 'onUserDetails');
    spyOn(component, 'checkUser');

    component.ngOnInit();

    expect(component.user).toEqual(mockUserService.detailedUser);
    expect(component.onUserDetails).toHaveBeenCalled();
    expect(component.checkUser).toHaveBeenCalled();
  });

  it('should delete a post and reload the page', () => {
    const postId = 123;
    spyOn(window.location, 'reload');
    mockAuthService.deletePost.and.returnValue(of({}));

    component.onDeletePost(postId);

    expect(mockAuthService.deletePost).toHaveBeenCalledWith(
      'fakeToken',
      postId
    );
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should add a new comment', () => {
    const postId = 123;
    const form = component.addNewCommentForm;
    form.setValue({ commentBody: 'Test comment' });

    mockAuthService.createPostComment.and.returnValue(of({}));

    component.onAddComment(form, postId);

    expect(mockAuthService.createPostComment).toHaveBeenCalledWith(
      'fakeToken',
      postId,
      jasmine.objectContaining({
        body: 'Test comment',
        post_id: postId,
      })
    );
  });

  it('should fetch user posts', () => {
    const mockPosts = [{ id: 1, title: 'Test Post' }];
    mockAuthService.getUserPosts.and.returnValue(of(mockPosts));

    component.onUserDetails();

    expect(mockAuthService.getUserPosts).toHaveBeenCalledWith('fakeToken', 1);
    expect(component.posts).toEqual(mockPosts);
  });

  it('should fetch comments for a post', () => {
    const postId = 1;
    const mockComments = [{ id: 1, body: 'Test Comment' }];
    mockAuthService.getPostComment.and.returnValue(of(mockComments));

    component.seeComments(postId);

    expect(mockAuthService.getPostComment).toHaveBeenCalledWith(
      'fakeToken',
      postId
    );
    expect(component.comments).toEqual(mockComments);
  });

  it('should delete a comment and reload the page', () => {
    const commentId = 123;
    spyOn(window.location, 'reload');
    mockAuthService.deleteComment.and.returnValue(of({}));

    component.onDeleteComment(commentId);

    expect(mockAuthService.deleteComment).toHaveBeenCalledWith(
      'fakeToken',
      commentId
    );
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should check if user exists', () => {
    component.checkUser();
    expect(component.userExist).toBeTrue();
  });
});
