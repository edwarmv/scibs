import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradasComponent as EntradasMainComponent } from './entradas.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '@layout/header/header.module';
import { ButtonModule } from '@ui/button/button.module';
import { CheckboxModule } from '@ui/checkbox/checkbox.module';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { InputModule } from '@ui/input/input.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IconModule } from '@ui/icon/icon.module';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { TabModule } from '@ui/tab/tab.module';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { EntradasComponent } from './entradas/entradas.component';
import { TableModule } from '@ui/table/table.module';
import { RegistrarEntradasComponent } from './dialog/registrar-entradas/registrar-entradas.component';
import { DialogModule } from '@ui/dialog/dialog.module';
import { ComprobantesEntradasComponent } from './comprobantes-entradas/comprobantes-entradas.component';
import { ProveedoresDialogComponent } from './proveedores/proveedores-dialog/proveedores-dialog.component';
import { ComprobantesEntradasDialogComponent } from './comprobantes-entradas/comprobantes-entradas-dialog/comprobantes-entradas-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: EntradasMainComponent,
    children: [
      {
        path: '',
        component: EntradasComponent,
        title: 'Entradas',
      },
      {
        path: 'proveedores',
        component: ProveedoresComponent,
        title: 'Proveedores',
      },
      {
        path: 'comprobantes',
        component: ComprobantesEntradasComponent,
        title: 'Comprobantes de entradas',
      },
    ],
  },
];

@NgModule({
  declarations: [
    EntradasMainComponent,
    EntradasComponent,
    ProveedoresComponent,
    ProveedoresDialogComponent,
    RegistrarEntradasComponent,
    ComprobantesEntradasComponent,
    ComprobantesEntradasDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    HeaderModule,
    ButtonModule,
    CheckboxModule,
    FormFieldModule,
    InputModule,
    IconModule,
    DropdownModule,
    TabModule,
    TableModule,
    DialogModule,
  ],
})
export class EntradasModule {}
