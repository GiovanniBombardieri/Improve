import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Post } from '../../../models/post';

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

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seePosts();
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
