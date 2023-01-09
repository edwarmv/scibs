import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from './confirm-dialog.component';
import { ConfirmDialogService } from './confirm-dialog.service';
import { DialogModule } from '@angular/cdk/dialog';
import { ButtonModule } from '@ui/button/button.module';

@NgModule({
  declarations: [ConfirmDialogComponent],
  providers: [ConfirmDialogService],
  imports: [CommonModule, DialogModule, ButtonModule],
  exports: [ConfirmDialogComponent],
})
export class ConfirmDialogModule {}
