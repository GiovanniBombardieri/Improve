import { Component, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../../models/user';
import { MatDialog } from '@angular/material/dialog';
import { DialogContentComponent } from './dialog-content/dialog-content.component';
import { Router } from '@angular/router';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { UserServiceService } from '../../service/user-service.service';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  displayedColumns: string[] = [
    'info',
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
  isLoggedIn: boolean = false;
  detailedUser!: User;
  readonly dialog = inject(MatDialog);

  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.seeUsers();
  }

  seeUsers() {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.isLoggedIn = true;
      this.authService
        .getUserList(this.currentPage, this.perPage, storageToken)
        .subscribe((data: any) => {
          this.users = data;
        });
    }
  }

  onDeleteUser(id: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.isLoggedIn = true;
      this.authService.deleteUser(storageToken, id).subscribe((data) => {
        console.log(data);
      });
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContentComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openUserDialog(user: User) {
    const dialogRef = this.dialog.open(DialogUserComponent);

    this.userService.detailedUser = user;

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
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
