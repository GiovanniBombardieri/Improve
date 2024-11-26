import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { User } from '../../../../models/user';
import { Post } from '../../../../models/post';

@Component({
  selector: 'app-new-user-dialog',
  templateUrl: './new-user-dialog.component.html',
  styleUrl: './new-user-dialog.component.scss',
})
export class NewUserDialogComponent {
  addNewPost!: FormGroup;
  currentPage: number = 1;
  perPage: number = 12;
  userExist: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.addNewPost = new FormGroup({
      title: new FormControl(null, Validators.required),
      body: new FormControl(null, Validators.required),
    });

    this.checkUser();
  }

  onAddPost(form: FormGroup) {
    if (localStorage.getItem('currentUser')) {
      let currentUser = JSON.parse(localStorage.getItem('currentUser')!);
      let currentUserId = currentUser.id;

      let newPost: Post = {
        id: 1000001,
        user_id: currentUserId,
        title: form.value.title,
        body: form.value.body,
      };

      const storageUser = JSON.parse(localStorage.getItem('userData')!);
      const storageToken = storageUser.token;

      if (storageToken) {
        this.authService
          .createNewPost(storageToken, currentUserId, newPost)
          .subscribe((data) => {
            console.log(data);
            location.reload();
          });
      }
    }
  }

  checkUser(): void {
    if (localStorage.getItem('currentUser')) {
      this.userExist = true;
    }
  }
}
