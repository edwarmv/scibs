import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function NumberGreaterThanValidator(value: number = 0): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (Number(control.value) > value) {
      return null;
    } else {
      return { numberGreaterThan: true };
    }
  };
}
