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
  currentPage: number = 1;
  perPage: number = 6;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.seePosts();
  }

  seePosts() {
    this.authService
      .getPostList(this.currentPage, this.perPage)
      .subscribe((data: any) => {
        this.posts = data;
      });
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
