import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../../models/user';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrl: './dialog-content.component.scss',
})
export class DialogContentComponent implements OnInit {
  addNewUserForm!: FormGroup;
  currentPage: number = 1;
  perPage: number = 12;
  newUser!: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.addNewUserForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      gender: new FormControl(null, Validators.required),
      token: new FormControl(null, Validators.required),
    });
  }

  onAddUser(form: FormGroup) {
    const newUser: User = {
      email: form.value.email,
      gender: form.value.gender,
      id: 1000100,
      name: form.value.name,
      status: 'active',
    };

    const storageUser = JSON.parse(localStorage.getItem('userData')!);
    const storageToken = storageUser.token;

    if (storageToken) {
      this.authService.createUser(storageToken, newUser).subscribe((data) => {
        this.newUser = data;
        localStorage.setItem('currentUser', JSON.stringify(this.newUser));
        location.reload();
      });
    }
  }
}
