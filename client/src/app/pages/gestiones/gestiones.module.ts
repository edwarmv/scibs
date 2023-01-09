import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GestionesComponent } from './gestiones.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '@layout/header/header.module';
import { IconModule } from '@ui/icon/icon.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { InputModule } from '@ui/input/input.module';
import { ButtonModule } from '@ui/button/button.module';
import { GestionesDialogComponent } from './gestiones-dialog/gestiones-dialog.component';
import { TableModule } from '@ui/table/table.module';
import { DialogModule } from '@ui/dialog/dialog.module';
import { CheckboxModule } from '@ui/checkbox/checkbox.module';

const routes: Routes = [
  {
    path: '',
    component: GestionesComponent,
  },
];

@NgModule({
  declarations: [GestionesComponent, GestionesDialogComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    HeaderModule,
    IconModule,
    FormFieldModule,
    CheckboxModule,
    InputModule,
    ButtonModule,
    TableModule,
    DialogModule,
  ],
})
export class GestionesModule {}
