import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownComponent } from './dropdown.component';
import { ButtonModule } from '@ui/button/button.module';
import { DropdownItemComponent } from './dropdown-item/dropdown-item.component';
import { IconModule } from '@ui/icon/icon.module';
import { InputModule } from '@ui/input/input.module';
import { ReactiveFormsModule } from '@angular/forms';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [DropdownComponent, DropdownItemComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    IconModule,
    InputModule,
    FormFieldModule,
    ScrollingModule,
  ],
  exports: [DropdownComponent, DropdownItemComponent],
})
export class DropdownModule {}
