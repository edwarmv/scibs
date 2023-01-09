import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

type LoginForm = {
  username: FormControl<string>;
  password: FormControl<string>;
};

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    class: 'flex flex-col items-center justify-center h-full',
  },
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup<LoginForm> = this.fb.nonNullable.group({
    username: ['edwarmv', Validators.required],
    password: ['qwerasdf', Validators.required],
  });

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      if (username && password) {
        this.authService.login(username, password).subscribe();
      }
    }
  }

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
