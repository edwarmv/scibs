import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { formatInputDateIsoDate } from '@helpers/format-input-date-iso-date.helper';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { AutocompleteDataSourceCb } from '@ui/form-field/autocomplete.data-source';
import { format } from 'date-fns';
import { map, Subject, takeUntil } from 'rxjs';
import { Gestion } from 'src/app/models/gestion.model';
import { ComprobantesEntradasService } from 'src/app/services/comprobantes-entradas.service';
import { GestionesService } from 'src/app/services/gestiones.service';

@Component({
  selector: 'app-cargar-saldos-dialog',
  templateUrl: './cargar-saldos-dialog.component.html',
  styleUrls: ['./cargar-saldos-dialog.component.scss'],
})
export class CargarSaldosDialogComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  gestionesAutocompleteCb: AutocompleteDataSourceCb<Gestion>;

  cargarSaldosForm: FormGroup<{
    from: FormGroup<{
      id: FormControl<number | null>;
      label: FormControl<string>;
    }>;
    to: FormGroup<{
      id: FormControl<number | null>;
      label: FormControl<string>;
    }>;
    fechaEntrada: FormControl<string>;
  }>;

  selectedFrom?: Gestion;
  selectedTo?: Gestion;

  constructor(
    private dialogRef: DialogRef<boolean>,
    private gestionesService: GestionesService,
    private comprobantesEntradasService: ComprobantesEntradasService
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

    this.cargarSaldosForm = new FormGroup({
      from: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: [Validators.required],
        }),
        label: new FormControl('', { nonNullable: true }),
      }),
      to: new FormGroup({
        id: new FormControl<number | null>(null, {
          validators: [Validators.required],
        }),
        label: new FormControl('', { nonNullable: true }),
      }),
      fechaEntrada: new FormControl(format(new Date(), 'yyyy-MM-dd'), {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });

    this.from
      ?.get('label')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (this.selectedFrom) {
          const label = getGestionLabel(this.selectedFrom);
          if (this.selectedFrom && label !== value) {
            this.from?.get('id')?.reset();
          }
        }
      });

    this.to
      ?.get('label')
      ?.valueChanges.pipe(takeUntil(this.unsubscribe$))
      .subscribe((value) => {
        if (this.selectedTo) {
          const label = getGestionLabel(this.selectedTo);
          if (this.selectedTo && label !== value) {
            this.to?.get('id')?.reset();
          }
        }
      });
  }

  onFromChange(gestion: Gestion) {
    this.selectedFrom = gestion;
    this.from?.patchValue({
      id: gestion.id,
      label: getGestionLabel(gestion),
    });
  }

  onToChange(gestion: Gestion) {
    this.selectedTo = gestion;
    this.to?.patchValue({
      id: gestion.id,
      label: getGestionLabel(gestion),
    });
  }

  cargarSaldos() {
    if (this.cargarSaldosForm.valid) {
      const { from, to, fechaEntrada } = this.cargarSaldosForm.value;
      if (from && from.id && to && to.id && fechaEntrada) {
        this.comprobantesEntradasService
          .cargarSaldosGestionAnterior({
            from: {
              id: from.id,
            },
            to: {
              id: to.id,
            },
            fechaEntrada: formatInputDateIsoDate(fechaEntrada),
          })
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get from() {
    return this.cargarSaldosForm.get('from');
  }

  get to() {
    return this.cargarSaldosForm.get('to');
  }

  get fechaEntrada() {
    return this.cargarSaldosForm.get('fechaEntrada');
  }
}
