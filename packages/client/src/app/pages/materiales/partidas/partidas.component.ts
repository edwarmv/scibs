import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { Subject, debounceTime } from 'rxjs';
import { Partida } from 'src/app/models/partida.model';
import { PartidasService } from 'src/app/partidas.service';
import { titleCase } from 'title-case';
import { PartidasDialogComponent } from './partidas-dialog/partidas-dialog.component';

@Component({
  selector: 'app-partidas',
  templateUrl: './partidas.component.html',
  styleUrls: ['./partidas.component.scss']
})
export class PartidasComponent implements OnInit {
  columns: Column<Partida>[] = [];
  @ViewChild('nombreColumn', { static: true })
  nombreColumn: TemplateRef<any>;
  @ViewChild('numeroColumn', { static: true })
  numeroColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<Partida>;

  @ViewChild('createPartidaButton', { static: true })
  createPartidaButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  constructor(
    private partidasService: PartidasService,
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
        name: 'Número',
        template: this.numeroColumn,
      },
    ];

    this.fetchData();

    this.term$.subscribe(() => {
      this.fetchData();
    });
  }

  registrarPartida() {
    this.dialog
      .open<Partida>(PartidasDialogComponent)
      .closed.subscribe((partida) => {
        if (partida) {
          this.fetchData();
        }
      });
  }

  onDblClickRow(value: Partida) {
    this.dialog
      .open<Partida, Partida>(PartidasDialogComponent, {
        data: value,
      })
      .closed.subscribe((partida) => {
        if (partida) {
          this.fetchData();
        }
      });
  }

  onBsRow(value: Partida) {
    this.confirmDialogService
      .open({
        title: 'Eliminar partida',
        message: `¿Desea eliminar a la partida: ${titleCase(
          value.nombre
        )}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.partidasService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchDataCb(): TableDataSourceCb<Partida> {
    return ({ skip, take }) =>
      this.partidasService.findAll({ skip, take, term: this.term });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchDataCb();
  }
}
