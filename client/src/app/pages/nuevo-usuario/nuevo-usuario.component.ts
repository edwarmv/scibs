import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { passwordMatched } from 'src/app/validators/password-matched.validator';

type Form = {
  nombre: FormControl<string>;
  apellido: FormControl<string>;
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
};

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.scss'],
  host: {
    class: 'flex flex-col items-center justify-center h-full',
  },
})
export class NuevoUsuarioComponent implements OnInit {
  form: FormGroup<Form> = this.fb.nonNullable.group(
    {
      nombre: ['edwar', Validators.required],
      apellido: ['martinez', Validators.required],
      username: ['edwarmv', [Validators.required]],
      password: ['qwerasdf', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['qwerasdf', [Validators.required, Validators.minLength(8)]],
    },
    { validators: [passwordMatched] }
  );

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.form.valid) {
      const { nombre, apellido, username, password } = this.form.value;
      if (nombre && apellido && username && password) {
        this.usuariosService
          .crear({
            nombre,
            apellido,
            username,
            password,
          })
          .subscribe(() => {
            this.authService.login(username, password).subscribe();
          });
      }
    }
  }

  get nombre() {
    return this.form.get('nombre');
  }

  get apellido() {
    return this.form.get('apellido');
  }

  get username() {
    return this.form.get('username');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }
}
