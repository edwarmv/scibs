import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoUsuarioComponent } from './nuevo-usuario.component';
import { RouterModule, Routes } from '@angular/router';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { IconModule } from '@ui/icon/icon.module';
import { ButtonModule } from '@ui/button/button.module';
import { InputModule } from '@ui/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';

export const routes: Routes = [{ path: '', component: NuevoUsuarioComponent }];

@NgModule({
  declarations: [NuevoUsuarioComponent],
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
export class NuevoUsuarioModule {}
