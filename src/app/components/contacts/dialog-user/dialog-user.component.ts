import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../../models/user';
import { UserServiceService } from '../../../service/user-service.service';
import { AuthService } from '../../../auth/auth.service';
import { Post } from '../../../../models/post';
import { Comment } from '../../../../models/comment';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  currentUserName: string | undefined;
  addComment: boolean = false;
  addNewCommentForm!: FormGroup;
  userExist: boolean = false;

  constructor(
    private userService: UserServiceService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.detailedUser;
    this.onUserDetails();
    this.checkUser();

    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      this.currentUserId = currentUser.id;
      this.currentUserName = currentUser.name;
    }

    this.addNewCommentForm = new FormGroup({
      commentBody: new FormControl(null, Validators.required),
    });
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

  onAddComment(form: FormGroup, postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      let currentUserEmail = currentUser.email;
      let currentUserName = currentUser.name;

      let newComment: Comment = {
        id: 1000001,
        post_id: postId,
        email: currentUserEmail,
        body: form.value.commentBody,
        name: currentUserName,
      };

      console.log(newComment);

      if (storageToken) {
        this.authService
          .createPostComment(storageToken, postId, newComment)
          .subscribe((data) => {
            console.log(data);
            location.reload();
          });
      }
    }
  }

  onDeleteComment(commentId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService
        .deleteComment(storageToken, commentId)
        .subscribe((data) => {
          console.log(data);
          location.reload();
        });
    }
  }

  checkUser(): void {
    if (localStorage.getItem('currentUser')) {
      this.userExist = true;
    }
  }
}
