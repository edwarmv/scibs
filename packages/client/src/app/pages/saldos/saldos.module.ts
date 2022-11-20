import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaldosComponent } from './saldos.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '@ui/input/input.module';
import { HeaderModule } from '@layout/header/header.module';
import { ButtonModule } from '@ui/button/button.module';
import { IconModule } from '@ui/icon/icon.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { CheckboxModule } from '@ui/checkbox/checkbox.module';

const routes: Routes = [
  {
    path: '',
    component: SaldosComponent,
  },
];

@NgModule({
  declarations: [SaldosComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormFieldModule,
    InputModule,
    HeaderModule,
    ButtonModule,
    IconModule,
    DropdownModule,
    CheckboxModule,
  ],
})
export class SaldosModule {}
