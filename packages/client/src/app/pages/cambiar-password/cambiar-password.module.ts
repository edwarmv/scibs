import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CambiarPasswordComponent } from './cambiar-password.component';
import { RouterModule, Routes } from '@angular/router';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { IconModule } from '@ui/icon/icon.module';
import { ReactiveFormsModule } from '@angular/forms';
import { InputModule } from '@ui/input/input.module';
import { ButtonModule } from '@ui/button/button.module';

export const routes: Routes = [
  {
    path: '',
    component: CambiarPasswordComponent,
  }
]

@NgModule({
  declarations: [
    CambiarPasswordComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormFieldModule,
    InputModule,
    ButtonModule,
    IconModule,
  ]
})
export class CambiarPasswordModule { }
