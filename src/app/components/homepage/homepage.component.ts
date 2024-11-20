import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  users: User[] = [];
  currentPage: number = 1;
  perPage: number = 20;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seeUsers();
  }

  seeUsers() {
    this.authService
      .getUserList(this.currentPage, this.perPage)
      .subscribe((data: any) => {
        this.users = data;
      });
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
}
