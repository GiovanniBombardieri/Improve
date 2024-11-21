import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Auth } from '../../models/auth';

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

  signUp(body: {}) {
    return this.http.post(this.url, body);
  }

  getUserList(page: number, perPage: number) {
    return this.http.get(`${this.url}/users?page=${page}&per_page=${perPage}`);
  }

  getPostList(page: number, perPage: number) {
    return this.http.get(`${this.url}/posts?page=${page}&per_page=${perPage}`);
  }
}
