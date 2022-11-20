import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevaCuentaComponent } from './nueva-cuenta.component';
import { RouterModule, Routes } from '@angular/router';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { IconModule } from '@ui/icon/icon.module';
import { ButtonModule } from '@ui/button/button.module';
import { InputModule } from '@ui/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [{ path: '', component: NuevaCuentaComponent }];

@NgModule({
  declarations: [NuevaCuentaComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormFieldModule,
    IconModule,
    ButtonModule,
    InputModule,
  ],
})
export class NuevaCuentaModule {}
