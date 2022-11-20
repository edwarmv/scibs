import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalidasComponent as SalidasMainComponent } from './salidas.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '@layout/header/header.module';
import { IconModule } from '@ui/icon/icon.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CheckboxModule } from '@ui/checkbox/checkbox.module';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { TabModule } from '@ui/tab/tab.module';
import { InputModule } from '@ui/input/input.module';
import { ButtonModule } from '@ui/button/button.module';
import { SolicitantesComponent } from './solicitantes/solicitantes.component';
import { SalidasComponent } from './salidas/salidas.component';
import { ComprobantesSalidasComponent } from './comprobantes-salidas/comprobantes-salidas.component';

const routes: Routes = [
  {
    path: '',
    component: SalidasMainComponent,
    children: [
      {
        path: '',
        component: SalidasComponent,
      },
      {
        path: 'solicitantes',
        component: SolicitantesComponent,
      },
      {
        path: 'comprobantes',
        component: ComprobantesSalidasComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    SalidasMainComponent,
    SalidasComponent,
    SolicitantesComponent,
    ComprobantesSalidasComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    HeaderModule,
    IconModule,
    FormFieldModule,
    InputModule,
    CheckboxModule,
    DropdownModule,
    TabModule,
    ButtonModule,
  ],
})
export class SalidasModule {}
