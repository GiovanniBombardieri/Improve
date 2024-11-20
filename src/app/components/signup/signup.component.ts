import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent implements OnInit {
  homeform!: FormGroup;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.homeform = new FormGroup({
      name: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      token: new FormControl(null, Validators.required),
    });
  }

  onSubmit(form: FormGroup) {
    const name = form.value.name;
    const gender = form.value.gender;
    const email = form.value.email;
    const token = form.value.token;

    this.authService
      .signUp({ name: name, gender: gender, email: email, token: token })
      .subscribe((data) => {
        console.log(data);
      });

    form.reset();
  }
}
