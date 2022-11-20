import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
} from '@angular/forms';
import { format, formatISO } from 'date-fns';
import { Gestion } from 'src/app/models/gestion.model';
import { GestionesService } from 'src/app/services/gestiones.service';

@Component({
  selector: 'app-gestiones-dialog',
  templateUrl: './gestiones-dialog.component.html',
  styleUrls: ['./gestiones-dialog.component.scss'],
})
export class GestionesDialogComponent implements OnInit {
  gestionForm: FormGroup<{
    fechaApertura: FormControl<string>;
    fechaCierre: FormControl<string>;
  }>;

  constructor(
    private dialogRef: DialogRef<Gestion>,
    @Inject(DIALOG_DATA) public data: Gestion,
    private gestionesService: GestionesService,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.gestionForm = this.fb.group({
      fechaApertura: [format(new Date(), 'yyyy-MM-dd'), Validators.required],
      fechaCierre: [''],
    });

    if (this.data) {
      const { fechaApertura, fechaCierre } = this.data;
      this.gestionForm.patchValue({
        fechaApertura: format(new Date(fechaApertura), 'yyyy-MM-dd'),
        fechaCierre,
      });
    }
  }

  onSubmit() {
    console.log(this.gestionForm.value, new Date());
    if (this.gestionForm.valid) {
      const { fechaApertura, fechaCierre } = this.gestionForm.value;
      if (this.data) {
        this.gestionesService
          .update(this.data.id, {
            fechaApertura: new Date(fechaApertura + 'T00:00').toISOString(),
            fechaCierre: fechaCierre
              ? new Date(fechaCierre + 'T00:00').toISOString()
              : '',
          })
          .subscribe((partida) => {
            this.dialogRef.close(partida);
          });
      } else {
        this.gestionesService
          .create({
            fechaApertura: new Date(fechaApertura + 'T00:00').toISOString(),
          })
          .subscribe((material) => {
            this.dialogRef.close(material);
          });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get fechaApertura() {
    return this.gestionForm.get('fechaApertura');
  }

  get fechaCierre() {
    return this.gestionForm.get('fechaCierre');
  }
}
