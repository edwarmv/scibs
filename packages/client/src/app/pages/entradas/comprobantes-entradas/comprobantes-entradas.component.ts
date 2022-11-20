import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, Subject } from 'rxjs';
import { ComprobanteEntradas } from 'src/app/models/comprobante-entradas.model';
import { ComprobantesEntradasService } from 'src/app/services/comprobantes-entradas.service';
import { titleCase } from 'title-case';
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
  @ViewChild('nombreColumn', { static: true })
  nombreColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('gestionColumn', { static: true })
  gestionColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<ComprobanteEntradas>;

  @ViewChild('createComprobanteEntradasButton', { static: true })
  createComprobanteEntradasButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  constructor(
    private comprobantesEntradasService: ComprobantesEntradasService,
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
        name: 'Nombre',
        template: this.nombreColumn,
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

  openComprobantesEntradasDialog(value?: ComprobanteEntradas) {
    this.dialog
      .open<ComprobanteEntradas, ComprobanteEntradas>(
        ComprobantesEntradasDialogComponent,
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

  onBsRow(value: ComprobanteEntradas) {
    this.confirmDialogService
      .open({
        title: 'Eliminar material',
        message: `¿Desea eliminar el comprobante de entrada con documento ${
          value.documento
        } del proveedor ${titleCase(value.proveedor.nombre)}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.comprobantesEntradasService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchData(): TableDataSourceCb<ComprobanteEntradas> {
    return ({ skip, take }) =>
      this.comprobantesEntradasService.findAll({
        skip,
        take,
        term: this.term,
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
