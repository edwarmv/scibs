import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { titleCase } from 'title-case';

@Component({
  selector: 'app-usuario-dialog',
  templateUrl: './usuario-dialog.component.html',
  styleUrls: ['./usuario-dialog.component.scss'],
})
export class UsuarioDialogComponent {
  usuarioForm: FormGroup<{
    id: FormControl<number>;
    nombre: FormControl<string>;
    apellido: FormControl<string>;
    username: FormControl<string>;
  }>;

  constructor(
    private fb: NonNullableFormBuilder,
    private dialogRef: DialogRef<Usuario>,
    private usuarioService: UsuariosService
  ) {
    this.usuarioForm = this.fb.group({
      id: [0, Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      username: ['', Validators.required],
    });
    this.usuarioService.profile().subscribe((usuario) => {
      if (usuario) {
        const { id, nombre, apellido, username } = usuario;
        this.usuarioForm.patchValue({
          id,
          nombre: titleCase(nombre),
          apellido: titleCase(apellido),
          username,
        });
      }
    });
  }

  onSubmit() {
    const id = this.id?.value;
    if (this.usuarioForm.valid) {
      const { id, nombre, apellido, username } = this.usuarioForm.value;
      if (id && nombre && apellido && username) {
        this.usuarioService
          .update(id, { nombre, apellido, username })
          .subscribe((usuario) => {
            this.dialogRef.close(usuario);
          });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get id() {
    return this.usuarioForm.get('id');
  }

  get nombre() {
    return this.usuarioForm.get('nombre');
  }

  get apellido() {
    return this.usuarioForm.get('apellido');
  }

  get username() {
    return this.usuarioForm.get('username');
  }
}
