import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../../models/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginFormControl!: FormGroup;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loginFormControl = new FormGroup({
      tokenControl: new FormControl(null, Validators.required),
    });
  }

  onLogin() {
    if (this.loginFormControl.valid) {
      let userData: Auth = {
        dateMill: new Date().getTime() + 60 * 60 * 1000,
        token: this.loginFormControl.get('tokenControl')?.value,
      };

      localStorage.setItem('userData', JSON.stringify(userData));

      this.router.navigate(['/contacts']);
    }
  }
}
