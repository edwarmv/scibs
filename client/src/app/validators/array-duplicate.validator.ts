import {
  AbstractControl,
  FormArray,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function ArrayDuplicateValidator<T>(
  mapCb: (value: T) => string | number
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control instanceof FormArray) {
      const values = control.value as Array<T>;
      if (values.length > 0) {
        const mappedValues = values.map(mapCb);
        return new Set(mappedValues).size !== mappedValues.length
          ? { arrayDuplicate: true }
          : null;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };
}
