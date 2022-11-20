import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NumberSmallerThanValidator(value: number = 0): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (Number(control.value) < value) {
      return { numberSmallerThan: true };
    } else {
      return null;
    }
  };
}
