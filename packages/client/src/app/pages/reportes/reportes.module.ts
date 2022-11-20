import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportesComponent } from './reportes.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from '@layout/header/header.module';
import { ButtonModule } from '@ui/button/button.module';

const routes: Routes = [
  {
    path: '',
    component: ReportesComponent,
  },
];

@NgModule({
  declarations: [ReportesComponent],
  imports: [CommonModule, RouterModule.forChild(routes), HeaderModule, ButtonModule],
})
export class ReportesModule {}
