import { AbstractControl, ValidationErrors } from '@angular/forms';

export const passwordMatched = (
  control: AbstractControl
): ValidationErrors | null => {
  const passwordValue = control.get('password')?.value;
  const confirmPasswordValue = control.get('confirmPassword')?.value;
  return passwordValue &&
    confirmPasswordValue &&
    passwordValue !== confirmPasswordValue
    ? { passwordMismatched: true }
    : null;
};
