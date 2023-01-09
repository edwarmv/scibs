import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { UnidadManejo } from 'src/app/models/unidad-manejo.model';
import { UnidadesManejoService } from 'src/app/services/unidades-manejo.service';

@Component({
  selector: 'app-unidades-manejo-dialog',
  templateUrl: './unidades-manejo-dialog.component.html',
  styleUrls: ['./unidades-manejo-dialog.component.scss'],
  host: {
    class: 'default-dialog-content',
  },
})
export class UnidadesManejoDialogComponent implements OnInit {
  unidadManejoForm: FormGroup<{
    nombre: FormControl<string>;
  }>;

  constructor(
    private dialogRef: DialogRef<UnidadManejo>,
    @Inject(DIALOG_DATA) public data: UnidadManejo,
    private fb: FormBuilder,
    private unidadesManejoService: UnidadesManejoService
  ) {}

  ngOnInit(): void {
    this.unidadManejoForm = this.fb.nonNullable.group({
      nombre: [this.data ? this.data.nombre : '', Validators.required],
    });
  }

  onSubmit() {
    if (this.unidadManejoForm.valid) {
      const { nombre } = this.unidadManejoForm.value;
      if (nombre) {
        if (this.data) {
          this.unidadesManejoService
            .update(this.data.id, { nombre })
            .subscribe((unidadManejo) => {
              this.dialogRef.close(unidadManejo);
            });
        } else {
          this.unidadesManejoService
            .create({ nombre })
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
    return this.unidadManejoForm.get('nombre');
  }
}
