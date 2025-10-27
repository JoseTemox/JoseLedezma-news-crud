/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AbstractControl,
  FormArray,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export class FormUtils {
  static isValidField(form: FormGroup, fielName: string): boolean | null {
    return !!form.controls[fielName].errors && form.controls[fielName].touched;
  }

  static getFielError(form: FormGroup, fieldName: string): string | null {
    if (!form.controls[fieldName]) {
      return null;
    }
    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextErrors(errors);
  }

  static isValidFieldNameArray(
    formArray: FormArray,
    index: number,
    item: string
  ): boolean | null {
    const currentControl = formArray.at(index) as FormGroup | null;
    if (!currentControl) {
      return null;
    }

    const child: AbstractControl | null = currentControl.get(item) ?? null;
    if (!child) {
      return null;
    }

    return !!child.errors && !!child.touched;
  }

  static getFielErrorInArray(
    formArray: FormArray,
    index: number,
    item: string
  ): string | null {
    const currentControl = formArray.at(index) as FormGroup | null;
    if (!currentControl) {
      return null;
    }

    const child: AbstractControl | null = currentControl.get(item) ?? null;
    if (!child) {
      return null;
    }
    const errors = child.errors ?? {};

    return FormUtils.getTextErrors(errors);
  }

  static getTextErrors(errors: ValidationErrors): string | null {
    if (!errors) {
      return null;
    }

    const handlers: Record<string, (err: any) => string> = {
      required: () => 'This field is required',
      minlength: (e) => `Min ${e.requiredLength} characters`,
      invalidUrlFormat: () => `Url format invalid`,
    };

    const key = Object.keys(errors).find((k) => k in handlers);
    return key
      ? handlers[key](errors[key])
      : `Validation error not controlled ${Object.keys(errors)[0]}`;
  }
}
