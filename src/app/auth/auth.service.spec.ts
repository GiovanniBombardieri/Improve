import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { Auth } from '../../models/auth';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let mockRouter: jasmine.SpyObj<Router>;

  const apiUrl = 'https://gorest.co.in/public/v2';
  const mockToken = 'test-token';
  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    gender: 'male',
    status: 'active',
  };
  const mockPost: Post = {
    id: 1,
    user_id: 1,
    title: 'Test Post',
    body: 'Test Body',
  };
  const mockComment: Comment = {
    id: 1,
    post_id: 1,
    name: 'Test Comment',
    email: 'comment@test.com',
    body: 'Comment Body',
  };

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        // provideHttpClient(),
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call loginUser and return an Auth object', () => {
    service.loginUser(mockToken).subscribe((res: Auth) => {
      expect(res).toEqual({ dateMill: 1, token: 'Test Token' } as Auth);
    });

    const req = httpMock.expectOne(`${apiUrl}/users`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush({ dateMill: 1, token: 'Test Token' } as Auth);
  });

  it('should call getUserList and return a list of users', () => {
    const mockResponse = [mockUser];
    service.getUserList(1, 12, mockToken).subscribe((res: any) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/users?page=1&per_page=12`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush(mockResponse);
  });

  it('should call createUser and send a POST request', () => {
    service.createUser(mockToken, mockUser).subscribe((res: any) => {
      expect(res).toEqual(mockUser);
    });

    const req = httpMock.expectOne(`${apiUrl}/users`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockUser);
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush(mockUser);
  });

  it('should call deleteUser and send a DELETE request', () => {
    service.deleteUser(mockToken, mockUser.id).subscribe((res: any) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${apiUrl}/users/${mockUser.id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush({});
  });

  it('should call getPostList and return a list of posts', () => {
    const mockResponse = [mockPost];
    service.getPostList(1, 10, mockToken).subscribe((res: any) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/posts?page=1&per_page=10`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush(mockResponse);
  });

  it('should call createNewPost and send a POST request', () => {
    service
      .createNewPost(mockToken, mockUser.id, mockPost)
      .subscribe((res: any) => {
        expect(res).toEqual(mockPost);
      });

    const req = httpMock.expectOne(`${apiUrl}/users/${mockUser.id}/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPost);
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush(mockPost);
  });

  it('should call deletePost and send a DELETE request', () => {
    service.deletePost(mockToken, mockPost.id).subscribe((res: any) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${apiUrl}/posts/${mockPost.id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush({});
  });

  it('should call getPostComment and return a list of comments', () => {
    const mockResponse = [mockComment];
    service.getPostComment(mockToken, mockPost.id).subscribe((res: any) => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${apiUrl}/posts/${mockPost.id}/comments`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush(mockResponse);
  });

  it('should call createPostComment and send a POST request', () => {
    service
      .createPostComment(mockToken, mockPost.id, mockComment)
      .subscribe((res: any) => {
        expect(res).toEqual(mockComment);
      });

    const req = httpMock.expectOne(`${apiUrl}/posts/${mockPost.id}/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComment);
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush(mockComment);
  });

  it('should call deleteComment and send a DELETE request', () => {
    service.deleteComment(mockToken, mockComment.id).subscribe((res: any) => {
      expect(res).toEqual({});
    });

    const req = httpMock.expectOne(`${apiUrl}/comments/${mockComment.id}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe(
      `Bearer ${mockToken}`
    );
    req.flush({});
  });
});
