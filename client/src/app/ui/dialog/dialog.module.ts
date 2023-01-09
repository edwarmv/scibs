import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule as CdkDialogModule } from '@angular/cdk/dialog';
import { DialogTitleDirective } from './dialog-title.directive';
import { DialogContentDirective } from './dialog-content.directive';
import { DialogActionsDirective } from './dialog-actions.directive';

@NgModule({
  declarations: [
    DialogTitleDirective,
    DialogContentDirective,
    DialogActionsDirective
  ],
  imports: [CommonModule, CdkDialogModule],
  exports: [CdkDialogModule, DialogTitleDirective, DialogContentDirective, DialogActionsDirective],
})
export class DialogModule {}
