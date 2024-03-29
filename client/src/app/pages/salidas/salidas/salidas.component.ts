import { Dialog } from '@angular/cdk/dialog';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { DropdownItem } from '@ui/dropdown/dropdown-item/dropdown-item.component';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, map, Subject, take, takeUntil } from 'rxjs';
import { ComprobanteSalidas } from 'src/app/models/comprobante-salidas.model';
import { Gestion } from 'src/app/models/gestion.model';
import { Material } from 'src/app/models/material.model';
import { Salida } from 'src/app/models/salida.model';
import { ComprobantesSalidasService } from 'src/app/services/comprobantes-salidas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { SalidasService } from 'src/app/services/salidas.service';
import { titleCase } from 'title-case';
import { ComprobantesSalidasDialogComponent } from '../comprobantes-salidas/comprobantes-salidas-dialog/comprobantes-salidas-dialog.component';

@Component({
  selector: 'app-salidas',
  templateUrl: './salidas.component.html',
  styleUrls: ['./salidas.component.scss'],
})
export class SalidasComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  columns: Column<Salida>[] = [];
  fetchDataCb: TableDataSourceCb<Salida>;
  @ViewChild('materialColumn', { static: true })
  materialColumn: TemplateRef<any>;
  @ViewChild('fechaColumn', { static: true })
  fechaColumn: TemplateRef<any>;
  @ViewChild('solicitanteColumn', { static: true })
  solicitanteColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('cantidadColumn', { static: true })
  cantidadColumn: TemplateRef<any>;

  @ViewChild('verMaterialAction', { static: true })
  verMaterialAction: TemplateRef<any>;
  @ViewChild('verEntradasAction', { static: true })
  verEntradasAction: TemplateRef<any>;
  @ViewChild('verSaldosAction', { static: true })
  verSaldosAction: TemplateRef<any>;
  @ViewChild('registrarSalidasAction', { static: true })
  registrarSalidasAction: TemplateRef<any>;

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

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;

  defaultMaterial: DropdownItem<Material> | null = null;

  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  constructor(
    private salidasService: SalidasService,
    private materialesService: MaterialesService,
    private gestionesService: GestionesService,
    private comprobantesSalidasService: ComprobantesSalidasService,
    private dialog: Dialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      { name: 'Material', template: this.materialColumn, sortable: true },
      { name: 'Fecha', template: this.fechaColumn, sortable: true },
      { name: 'Solicitante', template: this.solicitanteColumn, sortable: true },
      { name: 'Documento', template: this.documentoColumn },
      { name: 'Cantidad', template: this.cantidadColumn },
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

  openComprobantesSalidasDialog(salida?: Salida) {
    if (salida) {
      this.comprobantesSalidasService
        .findOne(salida.comprobanteSalidas.id)
        .pipe(take(1))
        .subscribe((comprobanteSalida) => {
          this.dialog
            .open<ComprobanteSalidas, ComprobanteSalidas>(
              ComprobantesSalidasDialogComponent,
              { data: comprobanteSalida }
            )
            .closed.subscribe((comprobanteSalidas) => {
              if (comprobanteSalidas) {
                this.fetchData();
              }
            });
        });
    } else {
      this.dialog
        .open<ComprobanteSalidas, ComprobanteSalidas>(
          ComprobantesSalidasDialogComponent
        )
        .closed.subscribe((comprobanteSalidas) => {
          if (comprobanteSalidas) {
            this.fetchData();
          }
        });
    }
  }

  private _fetchData(): TableDataSourceCb<Salida> {
    return ({ skip, take }) => {
      return this.salidasService.findAll({
        skip,
        take,
        term: this.term,
        materialId: this.selectedMaterial
          ? this.selectedMaterial.id.toString()
          : '',
        gestionId: this.selectedGestion
          ? this.selectedGestion.id.toString()
          : '',
      });
    };
  }

  onMaterialChange(material: Material | null) {
    this.selectedMaterial = material;
    this.fetchData();
  }

  onGestionChange(gestion: Gestion | null) {
    this.selectedGestion = gestion;
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

  verEntradas() {
    if (this.selectedMaterial) {
      this.router.navigate(['/entradas'], {
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
