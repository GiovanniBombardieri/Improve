import { Component } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  displayedColumns: string[] = [
    'status',
    'id',
    'name',
    'email',
    'gender',
    'delete',
  ];
  users!: User[];
  currentPage: number = 1;
  perPage: number = 12;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seeUsers();
  }

  seeUsers() {
    const authData = JSON.parse(localStorage.getItem('data') || '{}');
    const token =
      '9a88a3d1d56406dfd40f191c73781955948c5b1870d05b10681522b11d637ef3';

    if (token) {
      this.authService
        .getUserList(this.currentPage, this.perPage)
        .subscribe((data: any) => {
          this.users = data;
        });
    }
  }

  onChangePerPage(data: any) {
    console.log(data.value);
    this.perPage = data.value;
    this.seeUsers();
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
