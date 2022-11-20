import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { format } from 'date-fns';
import { debounceTime, Subject } from 'rxjs';
import { Gestion } from 'src/app/models/gestion.model';
import { GestionesService } from 'src/app/services/gestiones.service';
import { GestionesDialogComponent } from './gestiones-dialog/gestiones-dialog.component';

@Component({
  selector: 'app-gestiones',
  templateUrl: './gestiones.component.html',
  styleUrls: ['./gestiones.component.scss'],
})
export class GestionesComponent implements OnInit {
  columns: Column<Gestion>[] = [];
  @ViewChild('gestionColumn', { static: true })
  gestionColumn: TemplateRef<any>;
  @ViewChild('fechaAperturaColumn', { static: true })
  fechaAperturaColumn: TemplateRef<any>;
  @ViewChild('fechaCierreColumn', { static: true })
  fechaCierreColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<Gestion>;

  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  constructor(
    private gestionesService: GestionesService,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Gestión',
        template: this.gestionColumn,
      },
      {
        name: 'Fecha de apertura',
        template: this.fechaAperturaColumn,
      },
      {
        name: 'Fecha de cierre',
        template: this.fechaCierreColumn,
      },
    ];

    this.fetchData();

    this.term$.subscribe(() => {
      this.fetchData();
    });
  }

  openGestionDialog(value?: Gestion) {
    this.dialog
      .open<Gestion, Gestion>(GestionesDialogComponent, {
        data: value,
      })
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  onBsRow(value: Gestion) {
    this.confirmDialogService
      .open({
        title: 'Eliminar material',
        message: `¿Desea eliminar la gestion: ${format(
          new Date(value.fechaApertura),
          "dd 'de' MMMM 'de' yyyy"
        )}${value.fechaCierre ? ' -' + value.fechaCierre : ''}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.gestionesService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchData(): TableDataSourceCb<Gestion> {
    return ({ skip, take }) =>
      this.gestionesService.findAll({
        skip,
        take,
        term: this.term,
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }
}
