import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { formatISODateInputDate } from '@helpers/format-iso-date-input-date.helper';
import { AutocompleteDataSourceCb } from '@ui/form-field/autocomplete.data-source';
import { format } from 'date-fns';
import { map, Subject, takeUntil } from 'rxjs';
import { ComprobanteEntradas } from 'src/app/models/comprobante-entradas.model';
import { Entrada } from 'src/app/models/entrada.model';
import { Gestion } from 'src/app/models/gestion.model';
import { Material } from 'src/app/models/material.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import {
  ComprobantesEntradasService,
  CreateComprobanteEntradasDto,
} from 'src/app/services/comprobantes-entradas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { ArrayDuplicateValidator } from 'src/app/validators/array-duplicate.validator';
import { ArrayMinValidator } from 'src/app/validators/array-min.validator';
import { NumberGreaterThanValidator } from 'src/app/validators/number-greater-than.validator';
import { titleCase } from 'title-case';
import {
  LotesDialogComponent,
  LoteFormGroup,
  LoteFormValue,
} from './lotes-dialog/lotes-dialog.component';
import { formatInputDateIsoDate } from '@helpers/format-input-date-iso-date.helper';

type EntradasFormArrayGroup = FormGroup<{
  id: FormControl<number | null>;
  material: FormGroup<{
    id: FormControl<number | null>;
    nombre: FormControl<string>;
    prevNombre: FormControl<string>;
  }>;
  precioUnitario: FormControl<number>;
  cantidad: FormControl<number>;
  lotes: FormArray<LoteFormGroup>;
}>;

type EntradasFormArray = FormArray<EntradasFormArrayGroup>;

type ComprobanteEntradasForm = FormGroup<{
  documento: FormControl<string>;
  fechaEntrada: FormControl<string>;
  saldoGestionAnterior: FormControl<boolean>;
  gestion: FormGroup<{
    id: FormControl<number | null>;
    label: FormControl<string>;
  }>;
  proveedor: FormGroup<{
    id: FormControl<number | null>;
    nombre: FormControl<string>;
  }>;
  entradas: EntradasFormArray;
}>;

@Component({
  selector: 'app-comprobantes-entradas-dialog',
  templateUrl: './comprobantes-entradas-dialog.component.html',
  styleUrls: ['./comprobantes-entradas-dialog.component.scss'],
})
export class ComprobantesEntradasDialogComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  comprobanteEntradasForm: ComprobanteEntradasForm;

  gestionesAutocompleteCb: AutocompleteDataSourceCb<Gestion>;
  selectedGestion?: Gestion;
  proveedoresAutocompleteCb: AutocompleteDataSourceCb<Proveedor>;
  selectedProveedor?: Proveedor;
  materialesAutocompleteCb: AutocompleteDataSourceCb<Material>;

  focusedRow = false;

  constructor(
    private dialogRef: DialogRef<boolean>,
    @Inject(DIALOG_DATA) public data: ComprobanteEntradas,
    private gestionesService: GestionesService,
    private proveedoresService: ProveedoresService,
    private materialesService: MaterialesService,
    private comprobantesEntradasService: ComprobantesEntradasService,
    private dialog: Dialog
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

    this.proveedoresAutocompleteCb = ({ skip, take, term }) =>
      this.proveedoresService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: titleCase(value.nombre),
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

    this.comprobanteEntradasForm = new FormGroup({
      documento: new FormControl('', {
        validators: Validators.required,
        nonNullable: true,
      }),
      fechaEntrada: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
        validators: Validators.required,
        nonNullable: true,
      }),
      saldoGestionAnterior: new FormControl(false, { nonNullable: true }),
      gestion: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: Validators.required,
        }),
        label: new FormControl('', { nonNullable: true }),
      }),
      proveedor: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: Validators.required,
        }),
        nombre: new FormControl('', {
          validators: Validators.required,
          nonNullable: true,
        }),
      }),
      entradas: new FormArray<EntradasFormArrayGroup>(
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

    this.saldoGestionAnterior?.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (value) {
          this.documento?.disable();
          this.proveedor?.disable();
          this.documento?.setValue(this.data ? `000-${this.data.id}` : '000');
          this.proveedor?.patchValue({
            id: 0,
            nombre: 'Saldo gestión anterior',
          });
        }
      });

    if (this.data) {
      const {
        documento,
        fechaEntrada,
        saldoGestionAnterior,
        gestion,
        proveedor,
        entradas,
      } = this.data;
      this.comprobanteEntradasForm.patchValue({
        fechaEntrada: formatISODateInputDate(fechaEntrada),
        saldoGestionAnterior,
        gestion: {
          id: gestion.id,
          label: getGestionLabel(gestion),
        },
      });

      if (documento) {
        this.documento?.patchValue(documento);
        this.proveedor?.patchValue({
          id: proveedor.id,
          nombre: titleCase(proveedor.nombre),
        });
      }
      for (const entrada of entradas) {
        this.entradas.push(this.genEntrada(entrada));
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
          }
        }
      });

    this.proveedor
      ?.get('nombre')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (
          this.selectedProveedor &&
          titleCase(this.selectedProveedor.nombre) !== value
        ) {
          this.proveedor?.get('id')?.reset();
        }
      });
  }

  onSubmit() {
    if (this.comprobanteEntradasForm.valid) {
      const value = this.comprobanteEntradasForm
        .value as CreateComprobanteEntradasDto;

      const fechaEntrada = formatInputDateIsoDate(value.fechaEntrada);

      if (this.data) {
        this.comprobantesEntradasService
          .update(this.data.id, {
            ...value,
            ...{
              fechaEntrada,
            },
          })
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      } else {
        this.comprobantesEntradasService
          .create({ ...value, ...{ fechaEntrada } })
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      }
    }
  }

  addEntrada() {
    const entrada = this.genEntrada();

    entrada
      .get('material')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe(({ id, nombre, prevNombre }) => {
        if (id && nombre && prevNombre && nombre !== prevNombre) {
          entrada.get('material')?.get('id')?.reset();
        }
      });

    this.entradas.push(entrada);
  }

  genEntrada(entrada?: Entrada): EntradasFormArrayGroup {
    const entradaGroup = new FormGroup({
      id: new FormControl<number | null>(null),
      material: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: Validators.required,
        }),
        nombre: new FormControl('', { nonNullable: true }),
        prevNombre: new FormControl('', { nonNullable: true }),
      }),
      precioUnitario: new FormControl(0, {
        validators: NumberGreaterThanValidator(),
        nonNullable: true,
      }),
      cantidad: new FormControl(0, {
        validators: NumberGreaterThanValidator(),
        nonNullable: true,
      }),
      lotes: new FormArray<LoteFormGroup>([]),
    });

    if (entrada) {
      const { id, material, precioUnitario, cantidad } = entrada;
      entradaGroup.patchValue({
        id,
        material: {
          id: material.id,
          nombre: material.nombre,
          prevNombre: material.nombre,
        },
        precioUnitario,
        cantidad,
      });

      const lotesForm = entradaGroup.get('lotes') as FormArray<LoteFormGroup>;
      for (const lote of entrada.lotes) {
        lotesForm.push(
          new FormGroup({
            id: new FormControl(lote.id),
            fechaVencimiento: new FormControl(
              formatISODateInputDate(lote.fechaVencimiento),
              { nonNullable: true }
            ),
            lote: new FormControl(lote.lote, {
              nonNullable: true,
            }),
          })
        );
      }
    }

    return entradaGroup;
  }

  removeEntrada(index: number) {
    this.entradas.removeAt(index);
  }

  onGestionChange(gestion: Gestion) {
    this.selectedGestion = gestion;
    this.gestion?.patchValue({
      id: gestion.id,
      label: getGestionLabel(gestion),
    });
  }

  onProveedorChange(proveedor: Proveedor) {
    this.selectedProveedor = proveedor;
    this.proveedor?.patchValue({
      id: proveedor.id,
      nombre: titleCase(proveedor.nombre),
    });
  }

  onMaterialChange(index: number, material: Material) {
    this.entradas.controls[index].get('material')?.patchValue({
      id: material.id,
      nombre: titleCase(material.nombre),
      prevNombre: titleCase(material.nombre),
    });
  }

  openLotesDialog(entradaRowId: number) {
    this.dialog
      .open<LoteFormValue[] | void, { lotes: LoteFormValue[] }>(
        LotesDialogComponent,
        {
          data: {
            lotes: this.entradas.at(entradaRowId).get('lotes')?.getRawValue(),
          },
        }
      )
      .closed.subscribe((value) => {
        if (value) {
          this.loadLotes(entradaRowId, value);
        }
        if (value?.length === 0) {
          (
            this.entradas
              .at(entradaRowId)
              .get('lotes') as FormArray<LoteFormGroup>
          ).clear();
        }
      });
  }

  loadLotes(entradaRowId: number, lotesFormValue: LoteFormValue[]) {
    const lotesForm = this.entradas
      .at(entradaRowId)
      .get('lotes') as FormArray<LoteFormGroup>;
    lotesForm.clear();
    for (const loteFormValue of lotesFormValue) {
      const loteForm = new FormGroup({
        id: new FormControl(loteFormValue.id),
        fechaVencimiento: new FormControl(
          formatInputDateIsoDate(loteFormValue.fechaVencimiento),
          {
            nonNullable: true,
          }
        ),
        lote: new FormControl(loteFormValue.lote, { nonNullable: true }),
      });
      lotesForm.push(loteForm);
    }
  }

  close() {
    this.dialogRef.close();
  }

  hasLotes(entradaRowId: number): boolean {
    const lotesForm = this.entradas
      .at(entradaRowId)
      .get('lotes') as FormArray<LoteFormGroup>;
    return lotesForm.length > 0;
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get documento() {
    return this.comprobanteEntradasForm.get('documento');
  }

  get fechaEntrada() {
    return this.comprobanteEntradasForm.get('fechaEntrada');
  }

  get saldoGestionAnterior() {
    return this.comprobanteEntradasForm.get('saldoGestionAnterior');
  }

  get gestion() {
    return this.comprobanteEntradasForm.get('gestion');
  }

  get proveedor() {
    return this.comprobanteEntradasForm.get('proveedor');
  }

  get entradas() {
    return this.comprobanteEntradasForm.get('entradas') as EntradasFormArray;
  }
}
