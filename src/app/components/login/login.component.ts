import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  homeform!: FormGroup;

  constructor() {}

  ngOnInit(): void {
    this.homeform = new FormGroup({
      token: new FormControl(null, Validators.required),
    });
  }

  onLogin() {
    if (this.homeform.valid) {
      let authData: Auth = {
        dateMill: new Date().getTime() + 60 * 60 * 1000,
        token: this.homeform.get('token')?.value,
      };
      console.log(authData);
    }
  }
}
