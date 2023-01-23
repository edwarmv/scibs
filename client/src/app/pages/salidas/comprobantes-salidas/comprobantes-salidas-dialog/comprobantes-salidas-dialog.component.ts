import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { formatISODateInputDate } from '@helpers/format-iso-date-input-date.helper';
import { AutocompleteDataSourceCb } from '@ui/form-field/autocomplete.data-source';
import { format } from 'date-fns';
import { map, Subject, takeUntil } from 'rxjs';
import { ComprobanteSalidas } from 'src/app/models/comprobante-salidas.model';
import { Gestion } from 'src/app/models/gestion.model';
import { Material } from 'src/app/models/material.model';
import { Salida } from 'src/app/models/salida.model';
import { Solicitante } from 'src/app/models/solicitante.model';
import {
  ComprobantesSalidasService,
  CreateComprobanteSalidasDto,
} from 'src/app/services/comprobantes-salidas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { SolicitantesService } from 'src/app/services/solicitantes.service';
import { StockMaterialesService } from 'src/app/services/stock-materiales.service';
import { ArrayDuplicateValidator } from 'src/app/validators/array-duplicate.validator';
import { ArrayMinValidator } from 'src/app/validators/array-min.validator';
import { StockMaterialValidator } from 'src/app/validators/stock-material.validator';
import { NumberGreaterThanValidator } from 'src/app/validators/number-greater-than.validator';
import { titleCase } from 'title-case';
import { formatInputDateIsoDate } from '@helpers/format-input-date-iso-date.helper';

type SalidasFormArrayGroup = FormGroup<{
  id: FormControl<number | null>;
  material: FormGroup<{
    id: FormControl<number | null>;
    nombre: FormControl<string>;
    prevNombre: FormControl<string>;
  }>;
  cantidad: FormControl<number>;
  cantidadRegistrada: FormControl<number>;
  gestionId: FormControl<number | null>;
}>;

type SalidasFormArray = FormArray<SalidasFormArrayGroup>;

type ComprobanteSalidasForm = FormGroup<{
  documento: FormControl<string>;
  fechaSalida: FormControl<string>;
  gestion: FormGroup<{
    id: FormControl<number | null>;
    label: FormControl<string>;
  }>;
  solicitante: FormGroup<{
    id: FormControl<number | null>;
    nombre: FormControl<string>;
  }>;
  salidas: SalidasFormArray;
}>;

@Component({
  selector: 'app-comprobantes-salidas-dialog',
  templateUrl: './comprobantes-salidas-dialog.component.html',
  styleUrls: ['./comprobantes-salidas-dialog.component.scss'],
})
export class ComprobantesSalidasDialogComponent {
  unsubscribe$ = new Subject<void>();

  comprobanteSalidasForm: ComprobanteSalidasForm;

  gestionesAutocompleteCb: AutocompleteDataSourceCb<Gestion>;
  selectedGestion?: Gestion;
  solicitantesAutocompleteCb: AutocompleteDataSourceCb<Solicitante>;
  selectedSolicitante?: Solicitante;
  materialesAutocompleteCb: AutocompleteDataSourceCb<Material>;

  focusedRow = false;

  constructor(
    private dialogRef: DialogRef<ComprobanteSalidas>,
    @Inject(DIALOG_DATA) public data: ComprobanteSalidas,
    private gestionesService: GestionesService,
    private solicitantesService: SolicitantesService,
    private materialesService: MaterialesService,
    private comprobantesSalidasService: ComprobantesSalidasService,
    private stockMaterialesService: StockMaterialesService
  ) {}

  ngOnInit(): void {
    this.gestionesAutocompleteCb = ({ skip, take, term }) =>
      this.gestionesService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: getGestionLabel(value),
            value,
          })),
          total,
        }))
      );

    this.solicitantesAutocompleteCb = ({ skip, take, term }) =>
      this.solicitantesService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: `${titleCase(value.apellido)} ${titleCase(value.nombre)}`,
            value,
          })),
          total,
        }))
      );

    this.materialesAutocompleteCb = ({ skip, take, term }) =>
      this.materialesService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: titleCase(value.nombre),
            value,
          })),
          total,
        }))
      );

    this.comprobanteSalidasForm = new FormGroup({
      documento: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      fechaSalida: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
        validators: Validators.required,
        nonNullable: true,
      }),
      gestion: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: Validators.required,
        }),
        label: new FormControl('', { nonNullable: true }),
      }),
      solicitante: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: Validators.required,
        }),
        nombre: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
      }),
      salidas: new FormArray<SalidasFormArrayGroup>(
        [],
        [
          ArrayMinValidator(1),
          ArrayDuplicateValidator<{
            material: {
              id: number;
              nombre: string;
            };
            precioUnitario: number;
            cantidad: number;
          }>((value) => value.material.id),
        ]
      ),
    });

    if (this.data) {
      const { documento, fechaSalida, gestion, solicitante, salidas } =
        this.data;
      this.comprobanteSalidasForm.patchValue({
        fechaSalida: formatISODateInputDate(fechaSalida),
        gestion: {
          id: gestion.id,
          label: getGestionLabel(gestion),
        },
      });

      if (documento) {
        this.documento?.setValue(documento);
        this.solicitante?.patchValue({
          id: solicitante.id,
          nombre: `${titleCase(solicitante.apellido)} ${titleCase(
            solicitante.nombre
          )}`,
        });
      }

      for (const salida of salidas) {
        this.salidas.push(this.genSalida(salida));
      }
    }

    this.gestion
      ?.get('label')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (this.selectedGestion) {
          const label = getGestionLabel(this.selectedGestion);
          if (this.selectedGestion && label !== value) {
            this.gestion?.get('id')?.reset();
            for (const salida of this.salidas.controls) {
              salida.patchValue({
                gestionId: null,
              });
            }
          }
        }
      });

    this.solicitante
      ?.get('nombre')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (
          this.selectedSolicitante &&
          `${titleCase(this.selectedSolicitante.apellido)} ${titleCase(
            this.selectedSolicitante.nombre
          )}` !== value
        ) {
          this.solicitante?.get('id')?.reset();
        }
      });
  }

  onSubmit() {
    if (this.comprobanteSalidasForm.valid) {
      const value = this.comprobanteSalidasForm
        .value as CreateComprobanteSalidasDto;

      const fechaSalida = formatInputDateIsoDate(value.fechaSalida);

      if (this.data) {
        this.comprobantesSalidasService
          .update(this.data.id, { ...value, ...{ fechaSalida } })
          .subscribe((comprobanteEntradas) => {
            this.dialogRef.close(comprobanteEntradas);
          });
      } else {
        this.comprobantesSalidasService
          .create({ ...value, ...{ fechaSalida } })
          .subscribe((comprobanteEntradas) => {
            this.dialogRef.close(comprobanteEntradas);
          });
      }
    }
  }

  addSalida() {
    const salida = this.genSalida();

    salida
      .get('material')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ id, nombre, prevNombre }) => {
        if (id && nombre && prevNombre && nombre !== prevNombre) {
          salida.get('material')?.get('id')?.reset();
        }
      });

    this.salidas.push(salida);
  }

  genSalida(salida?: Salida): SalidasFormArrayGroup {
    const gestionId = this.gestion?.get('id')?.value;
    const salidaGroup = new FormGroup(
      {
        id: new FormControl<number | null>(null),
        material: new FormGroup({
          id: new FormControl<number | null>(null, {
            validators: Validators.required,
          }),
          nombre: new FormControl('', { nonNullable: true }),
          prevNombre: new FormControl('', { nonNullable: true }),
        }),
        cantidad: new FormControl(0, {
          validators: NumberGreaterThanValidator(),
          nonNullable: true,
        }),
        cantidadRegistrada: new FormControl(0, {
          nonNullable: true,
        }),
        gestionId: new FormControl<number | null>(gestionId ? gestionId : null),
      },
      {
        asyncValidators: StockMaterialValidator(this.stockMaterialesService),
      }
    );

    if (salida) {
      const { id, material, cantidad } = salida;
      salidaGroup.patchValue({
        id,
        material: {
          id: material.id,
          nombre: material.nombre,
          prevNombre: material.nombre,
        },
        cantidad,
        cantidadRegistrada: cantidad,
      });
    }

    return salidaGroup;
  }

  removeEntrada(index: number) {
    this.salidas.removeAt(index);
  }

  onGestionChange(gestion: Gestion) {
    this.selectedGestion = gestion;
    this.gestion?.patchValue({
      id: gestion.id,
      label: getGestionLabel(gestion),
    });
    for (const salida of this.salidas.controls) {
      salida.patchValue({
        gestionId: gestion.id,
      });
    }
  }

  onSolicitanteChange(solicitante: Solicitante) {
    this.selectedSolicitante = solicitante;
    this.solicitante?.patchValue({
      id: solicitante.id,
      nombre: `${titleCase(solicitante.apellido)} ${titleCase(
        solicitante.nombre
      )}`,
    });
  }

  onMaterialChange(index: number, material: Material) {
    this.salidas.controls[index].get('material')?.patchValue({
      id: material.id,
      nombre: titleCase(material.nombre),
      prevNombre: titleCase(material.nombre),
    });
  }

  close() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get documento() {
    return this.comprobanteSalidasForm.get('documento');
  }

  get fechaSalida() {
    return this.comprobanteSalidasForm.get('fechaSalida');
  }

  get gestion() {
    return this.comprobanteSalidasForm.get('gestion');
  }

  get solicitante() {
    return this.comprobanteSalidasForm.get('solicitante');
  }

  get salidas() {
    return this.comprobanteSalidasForm.get('salidas') as SalidasFormArray;
  }
}
