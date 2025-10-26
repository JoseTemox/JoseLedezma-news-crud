import {
  AbstractControl,
  FormArray,
  FormControl,
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

    // devolver si tiene errores y el formArray/child fue tocado
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
      required: () => 'Este campo es requerido',
      minlength: (e) => `Mínimo de ${e.requiredLength} caracteres`,
      // min: (e) => `Mínimo de ${e.min} caracteres`,
      // noStrider: () => 'Nombre no permitido',
      // email: () => 'mensaje de error del email',
      // emailTaken: () => 'Email no se encuentra disponible',
      // pattern: (e) =>
      //   e.requiredPattern === FormUtils.emailPattern
      //     ? 'El correo electronico no es permitido'
      //     : 'Error de patro contra ER',
    };

    const key = Object.keys(errors).find((k) => k in handlers);
    return key
      ? handlers[key](errors[key])
      : `Error de validación no controlado ${Object.keys(errors)[0]}`;
  }
}
