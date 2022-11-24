import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { Proveedor } from 'src/app/models/proveedor.model';
import { ProveedoresService } from 'src/app/services/proveedores.service';

@Component({
  selector: 'app-proveedores-dialog',
  templateUrl: './proveedores-dialog.component.html',
  styleUrls: ['./proveedores-dialog.component.scss'],
})
export class ProveedoresDialogComponent implements OnInit {
  proveedorForm: FormGroup<{
    nombre: FormControl<string>;
    nitCi: FormControl<string>;
  }>;

  constructor(
    private dialogRef: DialogRef<Proveedor>,
    @Inject(DIALOG_DATA) public data: Proveedor,
    private fb: NonNullableFormBuilder,
    private proveedoresService: ProveedoresService
  ) {}

  ngOnInit(): void {
    this.proveedorForm = this.fb.group({
      nombre: ['', Validators.required],
      nitCi: ['', Validators.required],
    });

    if (this.data) {
      this.proveedorForm.patchValue({
        nombre: this.data.nombre,
        nitCi: this.data.nitCi,
      });
    }
  }

  onSubmit() {
    if (this.proveedorForm.valid) {
      const { nombre, nitCi } = this.proveedorForm.value;
      if (nombre && nitCi) {
        if (this.data) {
          this.proveedoresService
            .update(this.data.id, { nombre, nitCi })
            .subscribe((unidadManejo) => {
              this.dialogRef.close(unidadManejo);
            });
        } else {
          this.proveedoresService
            .create({ nombre, nitCi })
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
    return this.proveedorForm.get('nombre');
  }

  get nitCi() {
    return this.proveedorForm.get('nitCi');
  }
}
