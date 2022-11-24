import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, Subject } from 'rxjs';
import { ComprobanteSalidas } from 'src/app/models/comprobante-salidas.model';
import { ComprobantesSalidasService } from 'src/app/services/comprobantes-salidas.service';
import { titleCase } from 'title-case';
import { ComprobantesSalidasDialogComponent } from './comprobantes-salidas-dialog/comprobantes-salidas-dialog.component';

@Component({
  selector: 'app-comprobantes-salidas',
  templateUrl: './comprobantes-salidas.component.html',
  styleUrls: ['./comprobantes-salidas.component.scss']
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

  constructor(
    private comprobantesSalidasService: ComprobantesSalidasService,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService
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
          value.documento
        } del proveedor ${titleCase(value.solicitante.nombre)}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.comprobantesSalidasService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchData(): TableDataSourceCb<ComprobanteSalidas> {
    return ({ skip, take }) =>
      this.comprobantesSalidasService.findAll({
        skip,
        take,
        term: this.term,
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
