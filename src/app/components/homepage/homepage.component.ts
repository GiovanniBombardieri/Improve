import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../../../models/post';
import { MatDialog } from '@angular/material/dialog';
import { NewPostDialogComponent } from './new-post-dialog/new-post-dialog.component';
import { Comment } from '../../../models/comment';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss',
})
export class HomepageComponent implements OnInit {
  posts: Post[] = [];
  allPost: Post[] = [];
  commentsArray: Comment[] = [];
  currentPage: number = 1;
  perPage: number = 24;
  isLoggedIn: boolean = false;
  haveComments: boolean = false;
  filteredList: Post[] = [];
  pagination: boolean = true;
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

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();

    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;
    if (storageToken) {
      this.pagination = false;
      if (filterValue !== undefined) {
        if (!filterValue) {
          this.filteredList = [...this.posts];
          this.pagination = true;
        } else {
          this.filteredList = this.posts.filter((post) =>
            post.title.toLowerCase().includes(filterValue)
          );
        }
      }
    }

    console.log(this.filteredList);
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
      this.filteredList = [];
      this.seePosts();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.filteredList = [];
      this.seePosts();
    }
  }

  nextPage(): void {
    this.currentPage++;
    this.filteredList = [];
    this.seePosts();
  }

  lastPage(): void {
    if (this.currentPage < 20) {
      this.currentPage = 20;
      this.filteredList = [];
      this.seePosts();
    }
  }
}
