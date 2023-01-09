import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';

import { CdkTableModule } from '@angular/cdk/table';
import { PaginatorComponent } from './paginator/paginator.component';
import { ButtonModule } from '@ui/button/button.module';
import { IconModule } from '@ui/icon/icon.module';
import { DropdownModule } from '@ui/dropdown/dropdown.module';
import { CellComponent } from './cell/cell.component';
import { FormFieldModule } from '@ui/form-field/form-field.module';
import { InputModule } from '@ui/input/input.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [TableComponent, PaginatorComponent, CellComponent],
  imports: [
    CommonModule,
    CdkTableModule,
    ButtonModule,
    IconModule,
    DropdownModule,
    FormFieldModule,
    InputModule,
    FormsModule,
  ],
  exports: [TableComponent, CellComponent],
})
export class TableModule {}
