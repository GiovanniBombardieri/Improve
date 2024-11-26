import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { UserServiceService } from '../../../service/user-service.service';
import { AuthService } from '../../../auth/auth.service';
import { Post } from '../../../../models/post';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrl: './dialog-user.component.scss',
})
export class DialogUserComponent implements OnInit {
  user!: User;
  posts: Post | any;
  comments: Comment | any;
  revealComments: boolean = false;
  data: any;
  currentUserId: number | undefined;

  constructor(
    private userService: UserServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.detailedUser;
    this.onUserDetails();

    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      this.currentUserId = currentUser.id;
    }
  }

  onDeletePost(postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService.deletePost(storageToken, postId).subscribe((data) => {
        location.reload();
      });
    }
  }

  onUserDetails() {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService
        .getUserPosts(storageToken, this.user.id)
        .subscribe((data) => {
          this.posts = data;
          console.log(this.posts);

          this.posts.forEach((element: any) => {
            this.seeComments(element.id);
            console.log(this.comments);
          });
        });
    }
  }

  seeComments(postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    this.authService.getPostComment(storageToken, postId).subscribe((data) => {
      this.comments = data;
    });
  }
}
