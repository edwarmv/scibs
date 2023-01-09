import { Dialog } from '@angular/cdk/dialog';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { getGestionLabel } from '@helpers/get-gestion-label.helper';
import { ConfirmDialogService } from '@ui/confirm-dialog/confirm-dialog.service';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { debounceTime, of, map, Observable, Subject } from 'rxjs';
import { Gestion } from 'src/app/models/gestion.model';
import { Material } from 'src/app/models/material.model';
import { Partida } from 'src/app/models/partida.model';
import { PartidasService } from 'src/app/partidas.service';
import { GestionesService } from 'src/app/services/gestiones.service';
import { MaterialesService } from 'src/app/services/materiales.service';
import { StockMaterialesService } from 'src/app/services/stock-materiales.service';
import { titleCase } from 'title-case';
import { MaterialesDialogComponent } from './materiales-dialog/materiales-dialog.component';

@Component({
  selector: 'app-materiales',
  templateUrl: './materiales.component.html',
  styleUrls: ['./materiales.component.scss'],
})
export class MaterialesComponent implements OnInit {
  columns: Column<Material>[] = [];
  @ViewChild('nombreColumn', { static: true })
  nombreColumn: TemplateRef<any>;
  @ViewChild('codigoColumn', { static: true })
  codigoColumn: TemplateRef<any>;
  @ViewChild('stockMinimoColumn', { static: true })
  stockMinimoColumn: TemplateRef<any>;
  @ViewChild('unidadManejoColumn', { static: true })
  unidadManejoColumn: TemplateRef<any>;
  @ViewChild('caracteristicasColumn', { static: true })
  caractericasColumn: TemplateRef<any>;
  fetchDataCb: TableDataSourceCb<Material>;

  @ViewChild('createMaterialButton', { static: true })
  createMaterialButton: TemplateRef<any>;

  @ViewChild('filterInput', { static: true })
  filterInput: TemplateRef<any>;
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable().pipe(debounceTime(300));

  @ViewChild('partidaFilter', { static: true })
  partidaFilter: TemplateRef<any>;
  partidasCb: DropdownDataCb<Partida>;
  partidaId?: number;

  @ViewChild('gestionFilter', { static: true })
  gestionFilter: TemplateRef<any>;
  gestionesDropdownCb: DropdownDataCb<Gestion>;
  selectedGestion: Gestion | null = null;

  constructor(
    private materialesService: MaterialesService,
    private partidasService: PartidasService,
    private dialog: Dialog,
    private confirmDialogService: ConfirmDialogService,
    private stockMaterialesServie: StockMaterialesService,
    private gestionesService: GestionesService
  ) {}

  ngOnInit(): void {
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

    this.partidasCb = ({ skip, take, term }) =>
      this.partidasService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((partida) => ({
            label: `${partida.numero} - ${partida.nombre}`,
            value: partida,
          })),
          total,
        }))
      );

    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Nombre',
        template: this.nombreColumn,
      },
      {
        name: 'Código',
        template: this.codigoColumn,
      },
      {
        name: 'Stock mínimo',
        template: this.stockMinimoColumn,
      },
      {
        name: 'Unidad de manejo',
        template: this.unidadManejoColumn,
      },
      {
        name: 'Características',
        template: this.caractericasColumn,
      },
    ];

    this.fetchData();

    this.term$.subscribe(() => {
      this.fetchData();
    });

    const { material }: { material: Material } = window.history.state;
    if (material) {
      this.term = material.nombre;
    }
  }

  registrarMaterial() {
    this.dialog
      .open<Material>(MaterialesDialogComponent)
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  onPartidaSelect(partida: Partida | null) {
    this.partidaId = partida ? partida.id : undefined;
    this.fetchData();
  }

  onGestionChange(gestion: Gestion | null) {
    this.selectedGestion = gestion;
    this.fetchData();
  }

  onDblClickRow(value: Material) {
    this.dialog
      .open<Material, Material>(MaterialesDialogComponent, {
        data: value,
      })
      .closed.subscribe((unidadManejo) => {
        if (unidadManejo) {
          this.fetchData();
        }
      });
  }

  onBsRow(value: Material) {
    this.confirmDialogService
      .open({
        title: 'Eliminar material',
        message: `¿Desea eliminar el material: ${titleCase(value.nombre)}?`,
      })
      .closed.subscribe((confirm) => {
        if (confirm) {
          this.materialesService.remove(value.id).subscribe(() => {
            this.fetchData();
          });
        }
      });
  }

  private _fetchData(): TableDataSourceCb<Material> {
    return ({ skip, take }) =>
      this.materialesService.findAll({
        skip,
        take,
        term: this.term,
        partidaId: this.partidaId,
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }

  getStockMaterial(idMaterial: number): Observable<string> {
    if (this.selectedGestion) {
      return this.stockMaterialesServie
        .getStockMaterial(idMaterial, { idGestion: this.selectedGestion.id })
        .pipe(map((stock) => `Saldo total: ${stock}`));
    } else {
      return of('Seleccione una gestión');
    }
  }
}
