import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DropdownItem } from '@ui/dropdown/dropdown-item/dropdown-item.component';

@Component({
  selector: 'app-saldos',
  templateUrl: './saldos.component.html',
  styleUrls: ['./saldos.component.scss']
})
export class SaldosComponent implements OnInit {
  form = this.fb.nonNullable.group({
    argumento: [''],
  });

  materiales: DropdownItem<string>[] = [
    {
      label: 'Algodón',
      value: 'Algodón',
    },
    {
      label: 'Jeringas',
      value: 'Jeringas',
    },
    {
      label: 'Barbijos',
      value: 'Barbijos',
    },
    {
      label: 'Alcohol',
      value: 'Alcohol',
    },
  ]

  gestiones: DropdownItem<string>[] = [
    {
      label: '2022',
      value: '2022',
    },
    {
      label: '2021',
      value: '2021',
    },
    {
      label: '2020',
      value: '2020',
    },
    {
      label: '2019',
      value: '2019',
    },
  ];


  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
  }

}
