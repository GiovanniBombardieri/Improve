import { Component, OnInit } from '@angular/core';
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
    this.checkUser();
    this.onUserDetails();

    this.addNewCommentForm = new FormGroup({
      commentBody: new FormControl(null, Validators.required),
    });
  }

  checkUser(): void {
    if (localStorage.getItem('currentUser')) {
      this.userExist = true;

      const currentUser = JSON.parse(
        localStorage.getItem('currentUser') || '{}'
      );
      if (!currentUser) {
        console.error('Current user not found in localStorage');
        return;
      }

      this.currentUserId = currentUser?.id || null;
      this.currentUserName = currentUser?.name || null;
    }
  }

  onUserDetails() {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    if (!storageUser) {
      console.error('User data not found in localStorage');
      return;
    }
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService
        .getUserPosts(storageToken, this.user.id)
        .subscribe((data) => {
          this.posts = data;

          this.posts.forEach((element: any) => {
            this.seeComments(element.id);
          });
        });
    }
  }

  onDeletePost(postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    if (!storageUser) {
      console.error('User data not found in localStorage');
      return;
    }
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService.deletePost(storageToken, postId).subscribe(() => {
        location.reload();
      });
    }
  }

  seeComments(postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    if (!storageUser) {
      console.error('User data not found in localStorage');
      return;
    }
    const storageToken = storageUser.token;

    this.authService.getPostComment(storageToken, postId).subscribe((data) => {
      this.comments = data;
    });
  }

  onAddComment(form: FormGroup, postId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    if (!storageUser) {
      console.error('User data not found in localStorage');
      return;
    }
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

      if (storageToken) {
        this.authService
          .createPostComment(storageToken, postId, newComment)
          .subscribe((data) => {
            location.reload();
          });
      }
    }
  }

  onDeleteComment(commentId: number) {
    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    if (!storageUser) {
      console.error('User data not found in localStorage');
      return;
    }
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
}
