import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function urlFormatValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (!v) {
      return null;
    }
    try {
      new URL(v);
      return null;
    } catch {
      return { invalidUrlFormat: true };
    }
  };
}
