import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, Subject } from 'rxjs';
import { UnidadManejo } from 'src/app/models/unidad-manejo.model';
import { UnidadesManejoService } from 'src/app/services/unidades-manejo.service';
import { UnidadesManejoDialogComponent } from './unidades-manejo-dialog/unidades-manejo-dialog.component';
import { titleCase } from 'title-case';

@Component({
  selector: 'app-unidades-manejo',
  templateUrl: './unidades-manejo.component.html',
  styleUrls: ['./unidades-manejo.component.scss'],
})
export class UnidadesManejoComponent implements OnInit {
  columns: Column<UnidadManejo>[] = [];
  @ViewChild('nombreColumn', { static: true })
  nombreColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<UnidadManejo>;

  @ViewChild('createUnidadManejoButton', { static: true })
  createUnidadManejoButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  constructor(
    private unidadesManejoService: UnidadesManejoService,
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
    ];

    this.fetchData();

    this.term$.subscribe(() => {
      this.fetchData();
    });
  }

  registrarUnidadManejo() {
    this.dialog
      .open<UnidadManejo>(UnidadesManejoDialogComponent)
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  onDblClickRow(value: UnidadManejo) {
    this.dialog
      .open<UnidadManejo, UnidadManejo>(UnidadesManejoDialogComponent, {
        data: value,
      })
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  onBsRow(value: UnidadManejo) {
    this.confirmDialogService
      .open({
        title: 'Eliminar unidad de manejo',
        message: `¿Desea eliminar a la unidad de manejo: ${titleCase(
          value.nombre
        )}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.unidadesManejoService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchDataCb(): TableDataSourceCb<UnidadManejo> {
    return ({ skip, take }) =>
      this.unidadesManejoService.findAll({ skip, take, term: this.term });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchDataCb();
  }
}
