import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import {
  VerSalidasSolicitanteDialogComponent,
  VerSalidasSolicitanteDialogData,
} from '@components/ver-salidas-solicitante-dialog/ver-salidas-solicitante-dialog.component';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, Subject } from 'rxjs';
import { Solicitante } from 'src/app/models/solicitante.model';
import { SolicitantesService } from 'src/app/services/solicitantes.service';
import { titleCase } from 'title-case';
import { SolicitantesDialogComponent } from './solicitantes-dialog/solicitantes-dialog.component';

@Component({
  selector: 'app-solicitantes',
  templateUrl: './solicitantes.component.html',
  styleUrls: ['./solicitantes.component.scss'],
})
export class SolicitantesComponent implements OnInit {
  columns: Column<Solicitante>[] = [];
  @ViewChild('apellidoColumn', { static: true })
  apellidoColumn: TemplateRef<any>;
  @ViewChild('nombreColumn', { static: true })
  nombreColumn: TemplateRef<any>;
  @ViewChild('ciColumn', { static: true })
  ciColumn: TemplateRef<any>;
  @ViewChild('verSalidasColumn', { static: true })
  verSalidasColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<Solicitante>;

  @ViewChild('createSolicitanteButton', { static: true })
  createSolicitanteButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  constructor(
    private solicitantesServicece: SolicitantesService,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Apellido',
        template: this.apellidoColumn,
      },
      {
        name: 'Nombre',
        template: this.nombreColumn,
      },
      {
        name: 'C.I.',
        template: this.ciColumn,
      },
      {
        name: 'Ver salidas',
        template: this.verSalidasColumn,
      },
    ];

    this.fetchData();

    this.term$.subscribe(() => {
      this.fetchData();
    });
  }

  openSolicitanteDialog(value?: Solicitante) {
    this.dialog
      .open<Solicitante, Solicitante>(SolicitantesDialogComponent, {
        data: value,
      })
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  openVerComprobanteDialog(solicitante: Solicitante) {
    this.dialog.open<void, VerSalidasSolicitanteDialogData>(
      VerSalidasSolicitanteDialogComponent,
      {
        data: {
          solicitante,
        },
      }
    );
  }

  onBsRow(value: Solicitante) {
    this.confirmDialogService
      .open({
        title: 'Eliminar solicitante',
        message: `¿Desea eliminar el solicitante: ${titleCase(
          value.apellido
        )} ${titleCase(value.nombre)} con C.I. ${value.ci}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.solicitantesServicece.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchData(): TableDataSourceCb<Solicitante> {
    return ({ skip, take }) =>
      this.solicitantesServicece.findAll({
        skip,
        take,
        term: this.term,
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
