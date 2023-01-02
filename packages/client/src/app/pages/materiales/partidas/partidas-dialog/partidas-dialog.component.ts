import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Partida } from 'src/app/models/partida.model';
import { PartidasService } from 'src/app/partidas.service';

@Component({
  selector: 'app-partidas-dialog',
  templateUrl: './partidas-dialog.component.html',
  styleUrls: ['./partidas-dialog.component.scss'],
  host: {
    class: 'default-dialog-content',
  },
})
export class PartidasDialogComponent implements OnInit {
  partidaForm: FormGroup<{
    nombre: FormControl<string>;
    numero: FormControl<number>;
  }>;

  constructor(
    private dialogRef: DialogRef<Partida>,
    @Inject(DIALOG_DATA) public data: Partida,
    private fb: FormBuilder,
    private partidasService: PartidasService
  ) {}

  ngOnInit(): void {
    this.partidaForm = this.fb.nonNullable.group({
      nombre: [this.data ? this.data.nombre : '', Validators.required],
      numero: [
        this.data ? this.data.numero : 0,
        [Validators.required, Validators.min(0)],
      ],
    });
  }

  onSubmit() {
    if (this.partidaForm.valid) {
      const { nombre, numero } = this.partidaForm.value;
      if (nombre && numero !== undefined) {
        if (this.data) {
          this.partidasService
            .update(this.data.id, { nombre, numero })
            .subscribe((partida) => {
              this.dialogRef.close(partida);
            });
        } else {
          this.partidasService
            .create({ nombre, numero })
            .subscribe((partida) => {
              this.dialogRef.close(partida);
            });
        }
      }
    }
  }

  close() {
    this.dialogRef.close();
  }

  get nombre() {
    return this.partidaForm.get('nombre');
  }

  get numero() {
    return this.partidaForm.get('numero');
  }
}
