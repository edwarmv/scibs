import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  VerComprobanteEntradasDialogComponent,
  VerComprobanteEntradasDialogData,
} from '@components/ver-comprobante-entradas-dialog/ver-comprobante-entradas-dialog.component';
import { ProveedoresDialogComponent } from './proveedores-dialog/proveedores-dialog.component';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, Subject } from 'rxjs';
import { Proveedor } from 'src/app/models/proveedor.model';
import { ProveedoresService } from 'src/app/services/proveedores.service';
import { titleCase } from 'title-case';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.scss'],
})
export class ProveedoresComponent implements OnInit {
  columns: Column<Proveedor>[] = [];
  @ViewChild('nombreColumn', { static: true })
  nombreColumn: TemplateRef<any>;
  @ViewChild('nitCiColumn', { static: true })
  nitCiColumn: TemplateRef<any>;
  @ViewChild('verIngresosColumn', { static: true })
  verIngresosColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<Proveedor>;

  @ViewChild('createProveedorButton', { static: true })
  createProveedorButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  constructor(
    private proveedoresServicece: ProveedoresService,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Nombre',
        template: this.nombreColumn,
      },
      {
        name: 'NIT / C.I.',
        template: this.nitCiColumn,
      },
      {
        name: 'Ver ingresos',
        template: this.verIngresosColumn,
      },
    ];

    this.fetchData();

    this.term$.subscribe(() => {
      this.fetchData();
    });
  }

  openProveedorDialog(value?: Proveedor) {
    this.dialog
      .open<Proveedor, Proveedor>(ProveedoresDialogComponent, {
        data: value,
      })
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  openVerComprobanteDialog(proveedor: Proveedor) {
    this.dialog.open<void, VerComprobanteEntradasDialogData>(
      VerComprobanteEntradasDialogComponent,
      {
        data: {
          proveedor: proveedor,
        },
      }
    );
  }

  onBsRow(value: Proveedor) {
    this.confirmDialogService
      .open({
        title: 'Eliminar proveedor',
        message: `¿Desea eliminar el proveedor: ${titleCase(
          value.nombre
        )} con NIT / C.I. ${value.nitCi}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.proveedoresServicece.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchData(): TableDataSourceCb<Proveedor> {
    return ({ skip, take }) =>
      this.proveedoresServicece.findAll({
        skip,
        take,
        term: this.term,
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
