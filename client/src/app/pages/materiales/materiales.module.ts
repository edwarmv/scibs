import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialesComponent as MaterialesMainComponent } from './materiales.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { InputModule } from '@ui/input/input.module';
import { HeaderModule } from '@layout/header/header.module';
import { IconModule } from '@ui/icon/icon.module';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { TabModule } from '@ui/tab/tab.module';
import { ButtonModule } from '@ui/button/button.module';
import { UnidadesManejoComponent } from './unidades-manejo/unidades-manejo.component';
import { PartidasComponent } from './partidas/partidas.component';
import { MaterialesComponent } from './materiales/materiales.component';
import { TableModule } from '@ui/table/table.module';
import { DialogModule } from '@ui/dialog/dialog.module';
import { UnidadesManejoDialogComponent } from './unidades-manejo/unidades-manejo-dialog/unidades-manejo-dialog.component';
import { PartidasDialogComponent } from './partidas/partidas-dialog/partidas-dialog.component';
import { MaterialesDialogComponent } from './materiales/materiales-dialog/materiales-dialog.component';
import { TooltipModule } from '@ui/tooltip/tooltip.module';

const routes: Routes = [
  {
    path: '',
    component: MaterialesMainComponent,
    children: [
      {
        path: '',
        component: MaterialesComponent,
        title: 'Materiales',
      },
      {
        path: 'unidades-manejo',
        component: UnidadesManejoComponent,
        title: 'Unidades de manejo',
      },
      {
        path: 'partidas',
        component: PartidasComponent,
        title: 'Partidas',
      },
    ],
  },
];

@NgModule({
  declarations: [
    MaterialesMainComponent,
    MaterialesComponent,
    UnidadesManejoComponent,
    PartidasComponent,
    UnidadesManejoDialogComponent,
    PartidasDialogComponent,
    MaterialesDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    FormFieldModule,
    InputModule,
    HeaderModule,
    IconModule,
    DropdownModule,
    TabModule,
    ButtonModule,
    TableModule,
    DialogModule,
    TooltipModule,
  ],
})
export class MaterialesModule {}
