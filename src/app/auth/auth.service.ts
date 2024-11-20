import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url: string = 'https://gorest.co.in/public/v2';

  constructor(private http: HttpClient) {}

  signUp(body: {}) {
    return this.http.post(this.url, body);
  }

  getUserList(page: number, perPage: number) {
    return this.http.get(`${this.url}/users?page=${page}&per_page=${perPage}`);
  }
}
