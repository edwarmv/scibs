import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, map, Subject } from 'rxjs';
import { ComprobanteSalidas } from 'src/app/models/comprobante-salidas.model';
import { Gestion } from 'src/app/models/gestion.model';
import { ComprobantesSalidasService } from 'src/app/services/comprobantes-salidas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { titleCase } from 'title-case';
import { ComprobantesSalidasDialogComponent } from './comprobantes-salidas-dialog/comprobantes-salidas-dialog.component';

@Component({
  selector: 'app-comprobantes-salidas',
  templateUrl: './comprobantes-salidas.component.html',
  styleUrls: ['./comprobantes-salidas.component.scss'],
})
export class ComprobantesSalidasComponent implements OnInit {
  columns: Column<ComprobanteSalidas>[] = [];
  @ViewChild('fechaColumn', { static: true })
  fechaColumn: TemplateRef<any>;
  @ViewChild('solicitanteColumn', { static: true })
  solicitanteColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('gestionColumn', { static: true })
  gestionColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<ComprobanteSalidas>;

  @ViewChild('createComprobanteSalidasButton', { static: true })
  createComprobanteSalidasButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  @ViewChild('materialesVencidosFilter', { static: true })
  materialesVencidosFilter: TemplateRef<any>;
  vencido = false;

  @ViewChild('gestionesFilter', { static: true })
  gestionesFilter: TemplateRef<any>;
  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  constructor(
    private comprobantesSalidasService: ComprobantesSalidasService,
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
        name: 'Solicitante',
        template: this.solicitanteColumn,
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

  openComprobantesEntradasDialog(value?: ComprobanteSalidas) {
    this.dialog
      .open<ComprobanteSalidas, ComprobanteSalidas>(
        ComprobantesSalidasDialogComponent,
        {
          data: value,
        }
      )
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  onBsRow(value: ComprobanteSalidas) {
    this.confirmDialogService
      .open({
        title: 'Eliminar material',
        message: `¿Desea eliminar el comprobante de entrada con documento ${
          value.vencido ? '000-' + value.id : value.documento
        } del solicitante ${
          value.vencido ? 'Vencido' : titleCase(value.solicitante.nombre)
        }?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.comprobantesSalidasService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  onVencidoChange() {
    this.fetchData();
  }

  onGestionChange(gestion: Gestion | null) {
    this.selectedGestion = gestion;
    this.fetchData();
  }

  private _fetchData(): TableDataSourceCb<ComprobanteSalidas> {
    return ({ skip, take }) =>
      this.comprobantesSalidasService.findAll({
        skip,
        take,
        term: this.term,
        vencido: this.vencido,
        gestionId: this.selectedGestion
          ? this.selectedGestion.id.toString()
          : '',
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
