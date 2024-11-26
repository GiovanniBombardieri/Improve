import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../../../models/post';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogComponent } from './new-user-dialog/new-user-dialog.component';
import { Comment } from '../../../models/comment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  posts!: Post[];
  commentsArray: Comment[] = [];
  currentPage: number = 1;
  perPage: number = 6;
  isLoggedIn: boolean = false;
  haveComments: boolean = false;
  i: number = 0;
  readonly dialog = inject(MatDialog);

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seePosts();
  }

  openDialog() {
    const dialogRef = this.dialog.open(NewPostDialogComponent);

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
            this.authService
              .getPostComment(storageToken, element.id)
              .subscribe((data: any) => {
                data.forEach((item: Comment) => {
                  this.commentsArray.push(item);
                });
              });
          });
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
