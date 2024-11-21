import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auth } from '../../../models/auth';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginFormControl!: FormGroup;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.loginFormControl = new FormGroup({
      tokenControl: new FormControl(null, Validators.required),
    });
  }

  onLogin() {
    if (this.loginFormControl.valid) {
      let data: Auth = {
        dateMill: new Date().getTime() + 60 * 60 * 1000,
        token: this.loginFormControl.get('tokenControl')?.value,
      };
      console.log(data);

      this.authService.loginUser(data.token).subscribe((loggedUser) => {
        localStorage.setItem('data:', JSON.stringify(data));
        this.router.navigate(['/contacts']);
      });
    }
  }
}
