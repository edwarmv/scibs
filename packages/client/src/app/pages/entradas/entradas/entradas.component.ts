import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { Entrada } from 'src/app/models/entrada.model';
import { EntradasService } from 'src/app/services/entradas.service';
import { Big } from 'big.js';
import { MaterialesService } from 'src/app/services/materiales.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { Material } from 'src/app/models/material.model';
import { Gestion } from 'src/app/models/gestion.model';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { titleCase } from 'title-case';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { Dialog } from '@angular/cdk/dialog';
import { ComprobantesEntradasDialogComponent } from '../comprobantes-entradas/comprobantes-entradas-dialog/comprobantes-entradas-dialog.component';
import { ComprobanteEntradas } from 'src/app/models/comprobante-entradas.model';
import { Router } from '@angular/router';
import { DropdownItem } from '@ui/dropdown/dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.component.html',
  styleUrls: ['./entradas.component.scss'],
})
export class EntradasComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  columns: Column<Entrada>[] = [];
  fetchDataCb: TableDataSourceCb<Entrada>;
  @ViewChild('materialColumn', { static: true })
  materialColumn: TemplateRef<any>;
  @ViewChild('fechaColumn', { static: true })
  fechaColumn: TemplateRef<any>;
  @ViewChild('proveedorColumn', { static: true })
  proveedorColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('cantidadColumn', { static: true })
  cantidadColumn: TemplateRef<any>;
  @ViewChild('precioUnitarioColumn', { static: true })
  precioUnitarioColumn: TemplateRef<any>;
  @ViewChild('valorTotalColumn', { static: true })
  valorTotalColumn: TemplateRef<any>;

  @ViewChild('cargarSaldosAction', { static: true })
  cargarSaldosAction: TemplateRef<any>;
  @ViewChild('verMaterialAction', { static: true })
  verMaterialAction: TemplateRef<any>;
  @ViewChild('verSalidasAction', { static: true })
  verSalidasAction: TemplateRef<any>;
  @ViewChild('verSaldosAction', { static: true })
  verSaldosAction: TemplateRef<any>;
  @ViewChild('registrarEntradasAction', { static: true })
  registrarEntradasAction: TemplateRef<any>;

  @ViewChild('saldosInicialesFilter', { static: true })
  saldosInicialesFilter: TemplateRef<any>;
  @ViewChild('materialesFilter', { static: true })
  materialesFilter: TemplateRef<any>;
  @ViewChild('gestionesFilter', { static: true })
  gestionesFilter: TemplateRef<any>;

  @ViewChild('browser', { static: true })
  browser: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject
    .asObservable()
    .pipe(takeUntil(this.unsubscribe$), debounceTime(300));

  saldoInicial = false;

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;

  defaultMaterial: DropdownItem<Material> | null = null;

  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  constructor(
    private entradasService: EntradasService,
    private materialesService: MaterialesService,
    private gestionesService: GestionesService,
    private dialog: Dialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      { name: 'Material', template: this.materialColumn, sortable: true },
      { name: 'Fecha', template: this.fechaColumn, sortable: true },
      { name: 'Proveedor', template: this.proveedorColumn, sortable: true },
      { name: 'Documento', template: this.documentoColumn },
      { name: 'Cantidad', template: this.cantidadColumn },
      { name: 'Precio unitario (Bs.)', template: this.precioUnitarioColumn },
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
    }
  }

  openComprobantesEntradasDialog() {
    this.dialog
      .open<ComprobanteEntradas, ComprobanteEntradas>(
        ComprobantesEntradasDialogComponent
      )
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  calcValorTotal(cantidad: number, precioUnitario: number): number {
    return new Big(cantidad).times(precioUnitario).toNumber();
  }

  private _fetchData(): TableDataSourceCb<Entrada> {
    return ({ skip, take }) => {
      return this.entradasService.findAll({
        skip,
        take,
        term: this.term,
        saldoInicial: this.saldoInicial,
        materialId: this.selectedMaterial
          ? this.selectedMaterial.id.toString()
          : '',
        gestionId: this.selectedGestion
          ? this.selectedGestion.id.toString()
          : '',
      });
    };
  }

  onSaldoInicialChange() {
    this.fetchData();
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

  fetchData() {
    this.fetchDataCb = this._fetchData();
  }

  verMaterial() {
    if (this.selectedMaterial) {
      this.router.navigate(['/materiales'], {
        state: { material: this.selectedMaterial },
      });
    }
  }

  verSalidas() {
    if (this.selectedMaterial) {
      this.router.navigate(['/salidas'], {
        state: { material: this.selectedMaterial },
      });
    }
  }

  verSaldos() {
    if (this.selectedMaterial) {
      this.router.navigate(['/saldos'], {
        state: { material: this.selectedMaterial },
      });
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
