import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../../models/auth';
import { User } from '../../models/user';

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
}
