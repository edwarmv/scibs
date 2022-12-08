import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalidasComponent as SalidasMainComponent } from './salidas.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '@layout/header/header.module';
import { IconModule } from '@ui/icon/icon.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@ui/checkbox/checkbox.module';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { TabModule } from '@ui/tab/tab.module';
import { InputModule } from '@ui/input/input.module';
import { ButtonModule } from '@ui/button/button.module';
import { SolicitantesComponent } from './solicitantes/solicitantes.component';
import { SalidasComponent } from './salidas/salidas.component';
import { ComprobantesSalidasComponent } from './comprobantes-salidas/comprobantes-salidas.component';
import { TableModule } from '@ui/table/table.module';
import { SolicitantesDialogComponent } from './solicitantes/solicitantes-dialog/solicitantes-dialog.component';
import { DialogModule } from '@ui/dialog/dialog.module';
import { ComprobantesSalidasDialogComponent } from './comprobantes-salidas/comprobantes-salidas-dialog/comprobantes-salidas-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: SalidasMainComponent,
    children: [
      {
        path: '',
        component: SalidasComponent,
        title: 'Salidas',
      },
      {
        path: 'solicitantes',
        component: SolicitantesComponent,
        title: 'Solicitantes',
      },
      {
        path: 'comprobantes',
        component: ComprobantesSalidasComponent,
        title: 'Comprobantes de salidas',
      },
    ],
  },
];

@NgModule({
  declarations: [
    SalidasMainComponent,
    SalidasComponent,
    SolicitantesComponent,
    SolicitantesDialogComponent,
    ComprobantesSalidasComponent,
    ComprobantesSalidasDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HeaderModule,
    IconModule,
    FormFieldModule,
    InputModule,
    CheckboxModule,
    DropdownModule,
    TableModule,
    DialogModule,
    TabModule,
    ButtonModule,
  ],
})
export class SalidasModule {}
