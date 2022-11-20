import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AutocompleteDataSourceCb } from '@ui/form-field/autocomplete.data-source';
import { map } from 'rxjs';
import { Material } from 'src/app/models/material.model';
import { Partida } from 'src/app/models/partida.model';
import { UnidadManejo } from 'src/app/models/unidad-manejo.model';
import { PartidasService } from 'src/app/partidas.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { UnidadesManejoService } from 'src/app/services/unidades-manejo.service';
import { titleCase } from 'title-case';

@Component({
  selector: 'app-materiales-dialog',
  templateUrl: './materiales-dialog.component.html',
  styleUrls: ['./materiales-dialog.component.scss'],
})
export class MaterialesDialogComponent implements OnInit {
  materialForm: FormGroup<{
    codigoIndex: FormControl<number | null>;
    nombre: FormControl<string>;
    stockMinimo: FormControl<number>;
    caracteristicas: FormControl<string>;
    unidadManejo: FormGroup<{
      id: FormControl<number | null>;
      nombre: FormControl<string>;
    }>;
    partida: FormGroup<{
      id: FormControl<number | null>;
      nombre: FormControl<string>;
    }>;
  }>;

  unidadManejoAutocompleteCb: AutocompleteDataSourceCb<UnidadManejo>;
  selectedUnidadManejo: UnidadManejo;
  partidaAutocompleteCb: AutocompleteDataSourceCb<Partida>;
  selectedPartida: Partida;

  constructor(
    private dialogRef: DialogRef<Material>,
    @Inject(DIALOG_DATA) public data: Material,
    private materialesService: MaterialesService,
    private undidadesManejoService: UnidadesManejoService,
    private partidasService: PartidasService
  ) {}

  ngOnInit(): void {
    this.materialForm = new FormGroup({
      codigoIndex: new FormControl<number | null>(null, {
        validators: [Validators.required],
      }),
      nombre: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
      stockMinimo: new FormControl(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(1)],
      }),
      caracteristicas: new FormControl('', {
        nonNullable: true,
      }),
      unidadManejo: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: [Validators.required],
        }),
        nombre: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
      partida: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: [Validators.required],
        }),
        nombre: new FormControl('', {
          nonNullable: true,
          validators: [Validators.required],
        }),
      }),
    });

    if (this.data) {
      const {
        codigoIndex,
        nombre,
        stockMinimo,
        caracteristicas,
        unidadManejo,
        partida,
      } = this.data;
      this.materialForm.patchValue({
        codigoIndex,
        nombre,
        stockMinimo,
        caracteristicas,
        unidadManejo,
        partida,
      });
    }

    this.unidadManejoAutocompleteCb = ({ skip, take, term }) =>
      this.undidadesManejoService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((unidadManejo) => ({
            label: `${titleCase(unidadManejo.nombre)}`,
            value: unidadManejo,
          })),
          total,
        }))
      );

    this.partidaAutocompleteCb = ({ skip, take, term }) =>
      this.partidasService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((partida) => ({
            label: `${partida.numero} - ${titleCase(partida.nombre)}`,
            value: partida,
          })),
          total,
        }))
      );

    this.partida?.get('nombre')?.valueChanges.subscribe((value) => {
      if (this.selectedPartida && this.selectedPartida.nombre !== value) {
        this.partida?.get('id')?.reset();
      }
    });

    this.unidadManejo?.get('nombre')?.valueChanges.subscribe((value) => {
      if (
        this.selectedUnidadManejo &&
        this.selectedUnidadManejo.nombre !== value
      ) {
        this.unidadManejo?.get('id')?.reset();
      }
    });
  }

  onSubmit() {
    if (this.materialForm.valid) {
      const {
        codigoIndex,
        nombre,
        stockMinimo,
        caracteristicas,
        unidadManejo,
        partida,
      } = this.materialForm.value;
      if (codigoIndex && nombre && stockMinimo && unidadManejo && partida) {
        if (this.data) {
          this.materialesService
            .update(this.data.id, {
              codigoIndex,
              nombre,
              stockMinimo,
              caracteristicas: caracteristicas ? caracteristicas : '',
              unidadManejo: unidadManejo as UnidadManejo,
              partida: partida as Partida,
            })
            .subscribe((partida) => {
              this.dialogRef.close(partida);
            });
        } else {
          this.materialesService
            .create({
              codigoIndex,
              nombre,
              stockMinimo,
              caracteristicas: caracteristicas ? caracteristicas : '',
              unidadManejo: unidadManejo as UnidadManejo,
              partida: partida as Partida,
            })
            .subscribe((material) => {
              this.dialogRef.close(material);
            });
        }
      }
    }
  }

  onUnidadManejoChange(unidadManejo: UnidadManejo) {
    this.selectedUnidadManejo = unidadManejo;
    this.unidadManejo?.patchValue({
      id: unidadManejo.id,
      nombre: unidadManejo.nombre,
    });
  }

  onPartidaChange(partida: Partida) {
    this.selectedPartida = partida;
    this.partida?.patchValue({
      id: partida.id,
      nombre: partida.nombre,
    });
  }

  close() {
    this.dialogRef.close();
  }

  get codigoIndex() {
    return this.materialForm.get('codigoIndex');
  }

  get nombre() {
    return this.materialForm.get('nombre');
  }

  get stockMinimo() {
    return this.materialForm.get('stockMinimo');
  }

  get caracteristicas() {
    return this.materialForm.get('caracteristicas');
  }

  get unidadManejo() {
    return this.materialForm.get('unidadManejo');
  }

  get partida() {
    return this.materialForm.get('partida');
  }
}
