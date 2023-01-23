import { DialogRef, DIALOG_DATA } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { formatISODateInputDate } from '@helpers/format-iso-date-input-date.helper';

export type LoteFormGroup = FormGroup<{
  id: FormControl<number | null>;
  fechaVencimiento: FormControl<string>;
  lote: FormControl<string>;
}>;

export type LoteFormValue = {
  id: number | null;
  fechaVencimiento: string;
  lote: string;
};

@Component({
  selector: 'app-lotes-dialog',
  templateUrl: './lotes-dialog.component.html',
  styleUrls: ['./lotes-dialog.component.scss'],
  host: {
    class: 'default-dialog-content',
  },
})
export class LotesDialogComponent {
  lotesForm: FormArray<LoteFormGroup>;

  focusedRow = false;

  constructor(
    @Inject(DIALOG_DATA) public data: { lotes: LoteFormValue[]; read: boolean },
    private dialogRef: DialogRef<LoteFormValue[]>
  ) {
    this.lotesForm = new FormArray<
      FormGroup<{
        id: FormControl<number | null>;
        fechaVencimiento: FormControl<string>;
        lote: FormControl<string>;
      }>
    >([]);
    const lotes = data.lotes;
    for (const lote of lotes) {
      this.lotesForm.push(
        new FormGroup({
          id: new FormControl(lote.id),
          fechaVencimiento: new FormControl(
            formatISODateInputDate(lote.fechaVencimiento),
            {
              nonNullable: true,
            }
          ),
          lote: new FormControl(lote.lote, { nonNullable: true }),
        })
      );
    }
    this.data.read && this.lotesForm.disable();
  }

  addLote() {
    const loteForm = new FormGroup({
      id: new FormControl<number | null>(null),
      fechaVencimiento: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      lote: new FormControl('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
    this.lotesForm.push(loteForm);
  }

  removeLote(i: number) {
    this.lotesForm.removeAt(i);
  }

  onSubmit() {
    this.dialogRef.close(this.lotesForm.getRawValue());
  }

  close() {
    this.dialogRef.close();
  }
}
