import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, Validators } from '@angular/forms';
import { Solicitante } from 'src/app/models/solicitante.model';
import { SolicitantesService } from 'src/app/services/solicitantes.service';

@Component({
  selector: 'app-solicitantes-dialog',
  templateUrl: './solicitantes-dialog.component.html',
  styleUrls: ['./solicitantes-dialog.component.scss']
})
export class SolicitantesDialogComponent {
  solicitanteForm: FormGroup<{
    nombre: FormControl<string>;
    apellido: FormControl<string>;
    ci: FormControl<string>;
  }>;

  constructor(
    private dialogRef: DialogRef<Solicitante>,
    @Inject(DIALOG_DATA) public data: Solicitante,
    private fb: NonNullableFormBuilder,
    private solicitantesService: SolicitantesService
  ) {}

  ngOnInit(): void {
    this.solicitanteForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      ci: ['', Validators.required],
    });

    if (this.data) {
      this.solicitanteForm.patchValue({
        nombre: this.data.nombre,
        apellido: this.data.apellido,
        ci: this.data.ci,
      });
    }
  }

  onSubmit() {
    if (this.solicitanteForm.valid) {
      const { nombre, apellido, ci } = this.solicitanteForm.value;
      if (nombre && apellido && ci) {
        if (this.data) {
          this.solicitantesService
            .update(this.data.id, { nombre, apellido, ci })
            .subscribe((unidadManejo) => {
              this.dialogRef.close(unidadManejo);
            });
        } else {
          this.solicitantesService
            .create({ nombre, apellido, ci })
            .subscribe((unidadManejo) => {
              this.dialogRef.close(unidadManejo);
            });
        }
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get nombre() {
    return this.solicitanteForm.get('nombre');
  }

  get apellido() {
    return this.solicitanteForm.get('apellido');
  }

  get ci() {
    return this.solicitanteForm.get('ci');
  }

}
