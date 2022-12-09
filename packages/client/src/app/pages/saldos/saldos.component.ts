import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { DropdownItem } from '@ui/dropdown/dropdown-item/dropdown-item.component';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import Big from 'big.js';
import { debounceTime, map, Subject, take, takeUntil } from 'rxjs';
import { Gestion } from 'src/app/models/gestion.model';
import { Material } from 'src/app/models/material.model';
import { StockMaterial } from 'src/app/models/stock-material.model';
import { GestionesService } from 'src/app/services/gestiones.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { StockMaterialesService } from 'src/app/services/stock-materiales.service';
import { titleCase } from 'title-case';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.scss'],
})
export class SaldosComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  columns: Column<StockMaterial>[] = [];
  fetchDataCb: TableDataSourceCb<StockMaterial>;
  @ViewChild('fechaEntradaColumn', { static: true })
  fechaEntradaColumn: TemplateRef<any>;
  @ViewChild('proveedorColumn', { static: true })
  proveedorColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('materialColumn', { static: true })
  materialColumn: TemplateRef<any>;
  @ViewChild('cantidadColumn', { static: true })
  cantidadColumn: TemplateRef<any>;
  @ViewChild('precioUnitarioColumn', { static: true })
  precioUnitarioColumn: TemplateRef<any>;
  @ViewChild('saldoColumn', { static: true })
  saldoColumn: TemplateRef<any>;
  @ViewChild('valorTotalColumn', { static: true })
  valorTotalColumn: TemplateRef<any>;

  saldosNulos = false;

  saldosIniciales = false;

  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject
    .asObservable()
    .pipe(takeUntil(this.unsubscribe$), debounceTime(300));

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;
  stockMaterial = 0;

  defaultMaterial: DropdownItem<Material> | null = null;

  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  constructor(
    private stockMaterialesService: StockMaterialesService,
    private materialesService: MaterialesService,
    private gestionesService: GestionesService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      { name: 'Fecha de entrada', template: this.fechaEntradaColumn },
      { name: 'Proveedor', template: this.proveedorColumn },
      { name: 'Documento', template: this.documentoColumn },
      { name: 'Material', template: this.materialColumn },
      { name: 'Cantidad', template: this.cantidadColumn },
      { name: 'Precio unitario (Bs.)', template: this.precioUnitarioColumn },
      { name: 'Saldo', template: this.saldoColumn },
      { name: 'Valor total (Bs.)', template: this.valorTotalColumn },
    ];

    this.fetchData();

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

    const { material }: { material: Material } = window.history.state;
    if (material) {
      this.defaultMaterial = {
        label: titleCase(material.nombre),
        value: material,
      };
      this.cd.detectChanges();
    }
  }

  calcValorTotal(cantidad: number, precioUnitario: number): number {
    return new Big(cantidad).times(precioUnitario).toNumber();
  }

  onSaldosNulosChange() {
    this.fetchData();
  }

  onSaldosInicialesChange() {
    this.fetchData();
  }

  onMaterialChange(material: Material | null) {
    material &&
      this.stockMaterialesService
        .getStockMaterial(material.id)
        .pipe(take(1))
        .subscribe((stock) => {
          this.stockMaterial = stock;
        });
    this.selectedMaterial = material;
    this.fetchData();
  }

  onGestionChange(gestion: Gestion | null) {
    this.selectedGestion = gestion;
    this.fetchData();
  }

  private _fetchData(): TableDataSourceCb<StockMaterial> {
    return ({ skip, take }) => {
      return this.stockMaterialesService.findAll({
        skip,
        take,
        term: this.term,
        idGestion: this.selectedGestion
          ? this.selectedGestion.id.toString()
          : '',
        idMaterial: this.selectedMaterial
          ? this.selectedMaterial.id.toString()
          : '',
        saldosNulos: this.saldosNulos,
        saldosIniciales: this.saldosIniciales,
      });
    };
  }

  fetchData() {
    this.fetchDataCb = this._fetchData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
