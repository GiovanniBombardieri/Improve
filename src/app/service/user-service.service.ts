import { Injectable } from '@angular/core';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  detailedUser!: User;

  constructor() {}

  setDetailedUser(user: User): void {
    this.detailedUser = user;
  }

  getDetailedUser(): User {
    return this.detailedUser;
  }
}
