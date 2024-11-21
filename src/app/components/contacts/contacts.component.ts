import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  displayedColumns: string[] = ['status', 'id', 'name', 'email', 'gender'];
  users!: User[];
  currentPage: number = 1;
  perPage: number = 12;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seeUsers();
  }

  seeUsers() {
    const authData = JSON.parse(localStorage.getItem('data') || '{}');
    const token = authData.token;

    if (token) {
      this.authService
        .getUserList(this.currentPage, this.perPage)
        .subscribe((data: any) => {
          this.users = data;
        });
    }
  }

  firstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.seeUsers();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.seeUsers();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.seeUsers();
  }

  lastPage(): void {
    if (this.currentPage < 20) {
      this.currentPage = 20;
      this.seeUsers();
    }
  }
}
