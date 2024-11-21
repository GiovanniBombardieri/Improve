import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginFormControl!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.loginFormControl = new FormGroup({
      tokenControl: new FormControl(null, Validators.required),
    });
  }

  onLogin() {
    if (this.loginFormControl.valid) {
      let authData: Auth = {
        dateMill: new Date().getTime() + 60 * 60 * 1000,
        token: this.loginFormControl.get('token')?.value,
      };
      console.log(authData);
    }
  }
}
