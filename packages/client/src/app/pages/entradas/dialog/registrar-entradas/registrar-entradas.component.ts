import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-registrar-entradas',
  templateUrl: './registrar-entradas.component.html',
  styleUrls: ['./registrar-entradas.component.scss'],
  host: {
    class: 'default-dialog-content',
  },
})
export class RegistrarEntradasComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    public dialogRef: DialogRef<string>,
    @Inject(DIALOG_DATA) public data: any
  ) {}

  form = this.fb.nonNullable.group({
    documento: [''],
    fechaEntrega: [''],
    proveedor: [''],
  });

  ngOnInit(): void {}
}
