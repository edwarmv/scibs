import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, map, Subject, take } from 'rxjs';
import { ComprobanteEntradas } from 'src/app/models/comprobante-entradas.model';
import { Gestion } from 'src/app/models/gestion.model';
import { ComprobantesEntradasService } from 'src/app/services/comprobantes-entradas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { titleCase } from 'title-case';
import { CargarSaldosDialogComponent } from '../cargar-saldos-dialog/cargar-saldos-dialog.component';
import { ComprobantesEntradasDialogComponent } from './comprobantes-entradas-dialog/comprobantes-entradas-dialog.component';

@Component({
  selector: 'app-comprobantes-entradas',
  templateUrl: './comprobantes-entradas.component.html',
  styleUrls: ['./comprobantes-entradas.component.scss'],
})
export class ComprobantesEntradasComponent implements OnInit {
  columns: Column<ComprobanteEntradas>[] = [];
  @ViewChild('fechaColumn', { static: true })
  fechaColumn: TemplateRef<any>;
  @ViewChild('proveedorColumn', { static: true })
  proveedorColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('gestionColumn', { static: true })
  gestionColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<ComprobanteEntradas>;

  @ViewChild('cargarSaldosAction', { static: true })
  cargarSaldosAction: TemplateRef<any>;
  @ViewChild('createComprobanteEntradasButton', { static: true })
  createComprobanteEntradasButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  @ViewChild('saldosGestionAnteriorFilter', { static: true })
  saldosGestionAnteriorFilter: TemplateRef<any>;
  saldoGestionAnterior = false;

  @ViewChild('gestionesFilter', { static: true })
  gestionesFilter: TemplateRef<any>;
  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  constructor(
    private comprobantesEntradasService: ComprobantesEntradasService,
    private confirmDialogService: ConfirmDialogService,
    private gestionesService: GestionesService,
    private dialog: Dialog
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Fecha',
        template: this.fechaColumn,
      },
      {
        name: 'Proveedor',
        template: this.proveedorColumn,
      },
      {
        name: 'Documento',
        template: this.documentoColumn,
      },
      {
        name: 'Gestión',
        template: this.gestionColumn,
      },
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
  }

  openComprobantesEntradasDialog(value?: ComprobanteEntradas) {
    if (value) {
      this.comprobantesEntradasService
        .findOne(value.id)
        .pipe(take(1))
        .subscribe((comprobanteEntradas) => {
          this.dialog
            .open<boolean, ComprobanteEntradas>(
              ComprobantesEntradasDialogComponent,
              {
                data: comprobanteEntradas,
              }
            )
            .closed.subscribe((value) => {
              if (value) {
                this.fetchData();
              }
            });
        });
    } else {
      this.dialog
        .open<boolean, ComprobanteEntradas>(ComprobantesEntradasDialogComponent)
        .closed.subscribe((value) => {
          if (value) {
            this.fetchData();
          }
        });
    }
  }

  onBsRow(value: ComprobanteEntradas) {
    this.confirmDialogService
      .open({
        title: 'Eliminar material',
        message: `¿Desea eliminar el comprobante de entrada con documento ${
          value.documento ? value.documento : '000'
        } del proveedor ${
          value.saldoGestionAnterior
            ? 'Saldo gestión anterior'
            : titleCase(value.proveedor.nombre)
        }?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.comprobantesEntradasService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  onSaldoGestionAnteriorChange() {
    this.fetchData();
  }

  openCargarSaldosDialog() {
    this.dialog.open(CargarSaldosDialogComponent).closed.subscribe((sucess) => {
      if (sucess) {
        this.fetchData();
      }
    });
  }

  onGestionChange(gestion: Gestion | null) {
    if (gestion) {
      this.selectedGestion = gestion;
    } else {
      this.selectedGestion = null;
    }
    this.fetchData();
  }

  private _fetchData(): TableDataSourceCb<ComprobanteEntradas> {
    return ({ skip, take }) =>
      this.comprobantesEntradasService.findAll({
        skip,
        take,
        term: this.term,
        saldoGestionAnterior: this.saldoGestionAnterior,
        gestionId: this.selectedGestion
          ? this.selectedGestion.id.toString()
          : '',
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
