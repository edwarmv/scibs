import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopiasSeguridadComponent } from './copias-seguridad.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '@layout/header/header.module';
import { ButtonModule } from '@ui/button/button.module';
import { IconModule } from '@ui/icon/icon.module';

const routes: Routes = [
  {
    path: '',
    component: CopiasSeguridadComponent,
  },
];

@NgModule({
  declarations: [CopiasSeguridadComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    HeaderModule,
    ButtonModule,
    IconModule,
  ],
})
export class CopiasSeguridadModule {}
