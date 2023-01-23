import { Dialog, DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { HeaderModule } from '@layout/header/header.module';
import { LotesDialogComponent } from '@pages/entradas/comprobantes-entradas/comprobantes-entradas-dialog/lotes-dialog/lotes-dialog.component';
import { ButtonModule } from '@ui/button/button.module';
import { DialogModule } from '@ui/dialog/dialog.module';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { IconModule } from '@ui/icon/icon.module';
import { InputModule } from '@ui/input/input.module';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { TableModule } from '@ui/table/table.module';
import Big from 'big.js';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';
import { Entrada } from 'src/app/models/entrada.model';
import { Gestion } from 'src/app/models/gestion.model';
import { Lote } from 'src/app/models/lote.model';
import { Material } from 'src/app/models/material.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { EntradasService } from 'src/app/services/entradas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { titleCase } from 'title-case';

export type VerEntradasProveedorDialogData = {
  proveedor: Proveedor;
};

@Component({
  selector: 'app-ver-entradas-proveedor-dialog',
  templateUrl: './ver-entradas-proveedor-dialog.component.html',
  styleUrls: ['./ver-entradas-proveedor-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderModule,
    TableModule,
    DialogModule,
    ButtonModule,
    FormFieldModule,
    InputModule,
    FormsModule,
    DropdownModule,
    IconModule,
  ],
})
export class VerEntradasProveedorDialogComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  columns: Column<Entrada>[] = [];
  @ViewChild('materialColumn', { static: true })
  materialColumn: TemplateRef<any>;
  @ViewChild('fechaColumn', { static: true })
  fechaColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('cantidadColumn', { static: true })
  cantidadColumn: TemplateRef<any>;
  @ViewChild('precioUnitarioColumn', { static: true })
  precioUnitarioColumn: TemplateRef<any>;
  @ViewChild('valorTotalColumn', { static: true })
  valorTotalColumn: TemplateRef<any>;
  @ViewChild('loteColumn', { static: true })
  loteColumn: TemplateRef<any>;

  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject
    .asObservable()
    .pipe(takeUntil(this.unsubscribe$), debounceTime(300));

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;

  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  fetchDataCb: TableDataSourceCb<Entrada>;

  constructor(
    @Inject(DIALOG_DATA) public data: VerEntradasProveedorDialogData,
    private dialogRef: DialogRef<void>,
    private entradasService: EntradasService,
    private materialesService: MaterialesService,
    private dialog: Dialog,
    private gestionesService: GestionesService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Material',
        template: this.materialColumn,
      },
      {
        name: 'Fecha',
        template: this.fechaColumn,
      },
      {
        name: 'Documento',
        template: this.documentoColumn,
      },
      {
        name: 'Cantidad',
        template: this.cantidadColumn,
      },
      {
        name: 'Precio unitario (Bs.)',
        template: this.precioUnitarioColumn,
      },
      {
        name: 'Valor total (Bs.)',
        template: this.valorTotalColumn,
      },
      {
        name: 'Lote',
        template: this.loteColumn,
      },
    ];

    this.term$.subscribe(() => {
      this.fetchData();
    });

    this.gestionesDropdownCb = ({ skip, take, term }) =>
      this.gestionesService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: getGestionLabel(value),
            value,
          })),
          total,
        }))
      );

    this.materialesDropdownCb = ({ skip, take, term }) =>
      this.materialesService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: titleCase(value.nombre),
            value,
          })),
          total,
        }))
      );

    this.fetchData();
  }

  close() {
    this.dialogRef.close();
  }

  onMaterialChange(material: Material | null) {
    if (material) {
      this.selectedMaterial = material;
    } else {
      this.selectedMaterial = null;
    }
    this.fetchData();
  }

  onGestionChange(gestion: Gestion | null) {
    if (gestion) {
      this.selectedGestion = gestion;
    } else {
      this.selectedGestion = null;
    }
    this.fetchData();
  }

  calcValorTotal(cantidad: number, precioUnitario: number): number {
    return new Big(cantidad).times(precioUnitario).toNumber();
  }

  openLotesDialog(lotes: Lote[]) {
    this.dialog.open<void, { lotes: Lote[]; read: boolean }>(
      LotesDialogComponent,
      {
        data: { lotes, read: true },
      }
    );
  }

  private _fetchData(): TableDataSourceCb<Entrada> {
    return ({ skip, take }) =>
      this.entradasService.findAll({
        skip,
        take,
        term: this.term,
        proveedorId: this.data.proveedor.id.toString(),
        materialId: this.selectedMaterial?.id.toString() || '',
        gestionId: this.selectedGestion?.id.toString() || '',
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
