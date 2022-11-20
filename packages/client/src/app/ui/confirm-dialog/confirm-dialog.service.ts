import { Dialog, DialogRef } from '@angular/cdk/dialog';
import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from './confirm-dialog.component';

export type ConfirmDialogData = {
  title: string;
  message: string;
  cancelBtnText?: string;
  confirmBtnText?: string;
};

@Injectable()
export class ConfirmDialogService {
  constructor(private dialog: Dialog) {}

  open(data: ConfirmDialogData): DialogRef<boolean, ConfirmDialogComponent> {
    return this.dialog.open(ConfirmDialogComponent, { data });
  }
}
