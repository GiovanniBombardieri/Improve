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

  constructor(
    private userService: UserServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.detailedUser;
    this.onUserDetails();
  }

  onUserDetails() {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService
        .getUserPosts(storageToken, this.user.id)
        .subscribe((data) => {
          this.posts = data;
        });
    }
  }

  seeComments(postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    this.authService.getPostComment(storageToken, postId).subscribe((data) => {
      this.comments = data;
      this.revealComments = true;
      console.log(this.comments);
    });
  }
}
