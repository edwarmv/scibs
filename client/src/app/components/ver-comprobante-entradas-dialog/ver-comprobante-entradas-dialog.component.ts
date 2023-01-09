import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
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
import { HeaderModule } from '@layout/header/header.module';
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
import { Material } from 'src/app/models/material.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { EntradasService } from 'src/app/services/entradas.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { titleCase } from 'title-case';

export type VerComprobanteEntradasDialogData = {
  proveedor: Proveedor;
};

@Component({
  selector: 'app-ver-comprobante-entradas-dialog',
  templateUrl: './ver-comprobante-entradas-dialog.component.html',
  styleUrls: ['./ver-comprobante-entradas-dialog.component.scss'],
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
export class VerComprobanteEntradasDialogComponent
  implements OnInit, OnDestroy
{
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

  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject
    .asObservable()
    .pipe(takeUntil(this.unsubscribe$), debounceTime(300));

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;

  fetchDataCb: TableDataSourceCb<Entrada>;

  constructor(
    @Inject(DIALOG_DATA) public data: VerComprobanteEntradasDialogData,
    private dialogRef: DialogRef<void>,
    private entradasService: EntradasService,
    private materialesService: MaterialesService
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
    ];

    this.term$.subscribe(() => {
      this.fetchData();
    });

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

  calcValorTotal(cantidad: number, precioUnitario: number): number {
    return new Big(cantidad).times(precioUnitario).toNumber();
  }

  private _fetchData(): TableDataSourceCb<Entrada> {
    return ({ skip, take }) =>
      this.entradasService.findAll({
        skip,
        take,
        term: this.term,
        proveedorId: this.data.proveedor.id.toString(),
        materialId: this.selectedMaterial?.id.toString() || '',
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
