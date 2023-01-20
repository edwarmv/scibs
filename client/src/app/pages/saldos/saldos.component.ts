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
import {
  debounceTime,
  map,
  Subject,
  switchMap,
  take,
  takeUntil,
  of,
  combineLatest,
} from 'rxjs';
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

  conSaldo = false;

  saldosNulos = false;

  saldosGestionAnterior = false;

  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject
    .asObservable()
    .pipe(takeUntil(this.unsubscribe$), debounceTime(300));

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;
  selectedMaterialSubject = new Subject<Material | null>();
  selectedMaterial$ = this.selectedMaterialSubject.asObservable();
  stockMaterial = { stock: 0, totalValorado: 0 };

  defaultMaterial: DropdownItem<Material> | null = null;

  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;
  selectedGestionSubject = new Subject<Gestion | null>();
  selectedGestion$ = this.selectedGestionSubject.asObservable();

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

    combineLatest({
      material: this.selectedMaterial$,
      gestion: this.selectedGestion$,
    })
      .pipe(
        switchMap(({ material, gestion }) => {
          if (material && gestion) {
            return this.stockMaterialesService
              .findAll({
                skip: 0,
                take: 1,
                idGestion: gestion.id.toString(),
                idMaterial: material.id.toString(),
              })
              .pipe(
                take(1),
                switchMap(({ total }) =>
                  this.stockMaterialesService
                    .findAll({
                      skip: 0,
                      take: total,
                      idGestion: gestion.id.toString(),
                      idMaterial: material.id.toString(),
                    })
                    .pipe(
                      switchMap(({ values }) => {
                        let stock = 0;
                        let totalValorado = 0;
                        for (const value of values) {
                          stock = new Big(stock).add(value.stock).toNumber();
                          totalValorado = new Big(totalValorado)
                            .add(
                              new Big(value.stock).times(
                                value.precioUnitarioEntrada
                              )
                            )
                            .toNumber();
                        }
                        return of({ stock, totalValorado });
                      })
                    )
                )
              );
          } else {
            return of({ stock: 0, totalValorado: 0 });
          }
        })
      )
      .subscribe((stock) => {
        this.stockMaterial = stock;
      });

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

  onConSaldoChange() {
    this.fetchData();
  }

  onSaldosGestionAnteriorChange() {
    this.fetchData();
  }

  onMaterialChange(material: Material | null) {
    this.selectedMaterialSubject.next(material);
    this.selectedMaterial = material;
    this.fetchData();
  }

  onGestionChange(gestion: Gestion | null) {
    this.selectedGestionSubject.next(gestion);
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
        saldosGestionAnterior: this.saldosGestionAnterior,
        conSaldo: this.conSaldo,
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
