import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../../models/auth';
import { User } from '../../models/user';
import { Post } from '../../models/post';
import { Comment } from '../../models/comment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'https://gorest.co.in/public/v2';

  constructor(private http: HttpClient, private router: Router) {}

  loginUser(token: string): Observable<Auth> {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get<Auth>(`${this.url}/users`, { headers });
  }

  getUserList(page: number, perPage: number, token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.url}/users?page=${page}&per_page=${perPage}`, {
      headers,
    });
  }

  getPostList(page: number, perPage: number, token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.url}/posts?page=${page}&per_page=${perPage}`, {
      headers,
    });
  }

  getAllPost(token: string) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.url}/posts?per_page=100`, { headers });
  }

  deleteUser(token: string, id: number | undefined) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.url}/users/${id}`, { headers });
  }

  createUser(token: string, user: User) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.url}/users`, user, { headers });
  }

  getUserPosts(token: string, id: number | undefined) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.url}/users/${id}/posts`, { headers });
  }

  getPostComment(token: string, id: number | undefined) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.get(`${this.url}/posts/${id}/comments`, { headers });
  }

  createNewPost(token: string, userId: number, body: Post) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.url}/users/${userId}/posts`, body, {
      headers,
    });
  }

  deletePost(token: string, postId: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.url}/posts/${postId}`, {
      headers,
    });
  }

  createPostComment(token: string, postId: number, commentBody: Comment) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.url}/posts/${postId}/comments`, commentBody, {
      headers,
    });
  }

  deleteComment(token: string, commentId: number) {
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', `Bearer ${token}`);

    return this.http.delete(`${this.url}/comments/${commentId}`, { headers });
  }
}
