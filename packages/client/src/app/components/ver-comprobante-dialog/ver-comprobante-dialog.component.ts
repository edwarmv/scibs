import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from '@layout/header/header.module';
import { ButtonModule } from '@ui/button/button.module';
import { DialogModule } from '@ui/dialog/dialog.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { InputModule } from '@ui/input/input.module';
import { TableDataSourceCb } from '@ui/table/table.data-source';
import { TableModule } from '@ui/table/table.module';
import { Subject } from 'rxjs';

export type VerComprobanteDialogData = {
  type: 'entradas' | 'salidas';
  subject: {
    nombre: string;
    identificador: string;
  };
};

@Component({
  selector: 'app-ver-comprobante-dialog',
  templateUrl: './ver-comprobante-dialog.component.html',
  styleUrls: ['./ver-comprobante-dialog.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    HeaderModule,
    TableModule,
    DialogModule,
    ButtonModule,
    FormFieldModule,
    InputModule,
    FormsModule
  ],
})
export class VerComprobanteDialogComponent implements OnInit {
  term = '';
  termSubject = new Subject<string>();
  term$ = this.termSubject.asObservable();

  // fetchDataCb: TableDataSourceCb<>;

  constructor(
    @Inject(DIALOG_DATA) public data: VerComprobanteDialogData,
    private dialogRef: DialogRef<void>
  ) {}

  ngOnInit(): void {}

  close() {
    this.dialogRef.close();
  }
}
