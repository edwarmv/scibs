import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from '@layout/header/header.module';
import { ButtonModule } from '@ui/button/button.module';
import { DialogModule } from '@ui/dialog/dialog.module';
import { DropdownDataCb } from '@ui/dropdown/dropdown.component';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { IconModule } from '@ui/icon/icon.module';
import { InputModule } from '@ui/input/input.module';
import { Column } from '@ui/table/table.component';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { TableModule } from '@ui/table/table.module';
import { debounceTime, map, Subject, takeUntil } from 'rxjs';
import { Material } from 'src/app/models/material.model';
import { Salida } from 'src/app/models/salida.model';
import { Solicitante } from 'src/app/models/solicitante.model';
import { MaterialesService } from 'src/app/services/materiales.service';
import { SalidasService } from 'src/app/services/salidas.service';
import { titleCase } from 'title-case';

export type VerComprobanteSalidasDialogData = {
  solicitante: Solicitante;
};

@Component({
  selector: 'app-ver-comprobante-salidas-dialog',
  templateUrl: './ver-comprobante-salidas-dialog.component.html',
  styleUrls: ['./ver-comprobante-salidas-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderModule,
    TableModule,
    DialogModule,
    ButtonModule,
    FormFieldModule,
    InputModule,
    FormsModule,
    DropdownModule,
    IconModule,
  ],
})
export class VerComprobanteSalidasDialogComponent implements OnInit, OnDestroy {
  unsubscribe$ = new Subject<void>();

  columns: Column<Salida>[] = [];
  @ViewChild('materialColumn', { static: true })
  materialColumn: TemplateRef<any>;
  @ViewChild('fechaColumn', { static: true })
  fechaColumn: TemplateRef<any>;
  @ViewChild('documentoColumn', { static: true })
  documentoColumn: TemplateRef<any>;
  @ViewChild('cantidadColumn', { static: true })
  cantidadColumn: TemplateRef<any>;

  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject
    .asObservable()
    .pipe(takeUntil(this.unsubscribe$), debounceTime(300));

  materialesDropdownCb: DropdownDataCb<Material>;
  selectedMaterial: Material | null = null;

  fetchDataCb: TableDataSourceCb<Salida>;

  constructor(
    @Inject(DIALOG_DATA) public data: VerComprobanteSalidasDialogData,
    private dialogRef: DialogRef<void>,
    private salidasService: SalidasService,
    private materialesService: MaterialesService
  ) {}

  ngOnInit(): void {
    this.columns = [
      { name: 'Nº', type: 'index' },
      {
        name: 'Material',
        template: this.materialColumn,
      },
      {
        name: 'Fecha',
        template: this.fechaColumn,
      },
      {
        name: 'Documento',
        template: this.documentoColumn,
      },
      {
        name: 'Cantidad',
        template: this.cantidadColumn,
      },
    ];

    this.term$.subscribe(() => {
      this.fetchData();
    });

    this.materialesDropdownCb = ({ skip, take, term }) =>
      this.materialesService.findAll({ skip, take, term }).pipe(
        map(({ values, total }) => ({
          values: values.map((value) => ({
            label: titleCase(value.nombre),
            value,
          })),
          total,
        }))
      );

    this.fetchData();
  }

  close() {
    this.dialogRef.close();
  }

  onMaterialChange(material: Material | null) {
    if (material) {
      this.selectedMaterial = material;
    } else {
      this.selectedMaterial = null;
    }
    this.fetchData();
  }

  private _fetchData(): TableDataSourceCb<Salida> {
    return ({ skip, take }) =>
      this.salidasService.findAll({
        skip,
        take,
        term: this.term,
        solicitanteId: this.data.solicitante.id.toString(),
        materialId: this.selectedMaterial?.id.toString() || '',
      });
  }

  private fetchData() {
    this.fetchDataCb = this._fetchData();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
