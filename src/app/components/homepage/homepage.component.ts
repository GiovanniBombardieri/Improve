import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../../../models/post';
import { MatDialog } from '@angular/material/dialog';
import { NewUserDialogComponent } from './new-user-dialog/new-user-dialog.component';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  posts!: Post[];
  comments: Comment[] | any;
  currentPage: number = 1;
  perPage: number = 6;
  isLoggedIn: boolean = false;
  haveComments: boolean = false;
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seePosts();
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewUserDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  seePosts() {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.isLoggedIn = true;
      this.authService
        .getPostList(this.currentPage, this.perPage, storageToken)
        .subscribe((data: any) => {
          this.posts = data;

          this.posts.forEach((element) => {
            this.seeComments(element.id);
          });
        });
    }
  }

  seeComments(id: number): void {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService.getPostComment(storageToken, id).subscribe((data) => {
        this.comments = data;
        console.log(this.comments);
      });
    }
  }

  firstPage(): void {
    if (this.currentPage > 1) {
      this.currentPage = 1;
      this.seePosts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.seePosts();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.seePosts();
  }

  lastPage(): void {
    if (this.currentPage < 20) {
      this.currentPage = 20;
      this.seePosts();
    }
  }
}
