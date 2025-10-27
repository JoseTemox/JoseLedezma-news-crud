import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormUtils } from './form-utils';

describe('FormUtils', () => {
  let fb: FormBuilder;

  beforeEach(() => {
    fb = new FormBuilder();
  });

  describe('isValidField', () => {
    it('throws when control is missing (reflects current implementation)', () => {
      const g = fb.group({});
      expect(() => FormUtils.isValidField(g, 'missing')).toThrowError(
        TypeError
      );
    });

    it('returns true when control has errors and is touched', () => {
      const g = fb.group({
        name: ['', Validators.required],
      });
      const ctrl = g.controls['name'];
      ctrl.markAsTouched();
      ctrl.setErrors({ required: true });
      expect(FormUtils.isValidField(g, 'name')).toBeTrue();
    });

    it('returns false when control has errors but not touched', () => {
      const g = fb.group({
        name: ['', Validators.required],
      });
      const ctrl = g.controls['name'];
      ctrl.setErrors({ required: true });
      expect(FormUtils.isValidField(g, 'name')).toBeFalse();
    });

    it('returns false when control has no errors', () => {
      const g = fb.group({
        name: ['ok'],
      });
      const ctrl = g.controls['name'];
      ctrl.markAsTouched();
      expect(FormUtils.isValidField(g, 'name')).toBeFalse();
    });
  });

  describe('getFielError', () => {
    it('returns generic message when control has an empty errors object', () => {
      const g = fb.group({
        maybe: [''],
      });
      const ctrl = g.controls['maybe'];

      (ctrl as any).errors = {};
      const msg = FormUtils.getFielError(g, 'maybe') ?? '';
      expect(msg).toContain('Validation error not controlled');
    });

    it('returns required message when control has required error', () => {
      const g = fb.group({
        title: ['', Validators.required],
      });
      const ctrl = g.controls['title'];
      ctrl.setErrors({ required: true });
      expect(FormUtils.getFielError(g, 'title')).toBe('This field is required');
    });

    it('returns minlength message when control has minlength error', () => {
      const g = fb.group({
        code: ['', Validators.minLength(3)],
      });
      const ctrl = g.controls['code'];
      ctrl.setErrors({ minlength: { requiredLength: 3, actualLength: 1 } });
      expect(FormUtils.getFielError(g, 'code')).toBe('Min 3 characters');
    });

    it('returns custom message for unknown error keys', () => {
      const g = fb.group({
        x: [''],
      });
      const ctrl = g.controls['x'];
      ctrl.setErrors({ someCustom: true });
      const msg = FormUtils.getFielError(g, 'x') ?? '';
      expect(msg).toContain('Validation error not controlled');
    });
  });

  describe('isValidFieldNameArray', () => {
    it('returns null when index out of range', () => {
      const arr = fb.array([]);
      expect(FormUtils.isValidFieldNameArray(arr, 0, 'foo')).toBeNull();
    });

    it('returns null when child control missing', () => {
      const arr = fb.array([fb.group({})]);
      expect(FormUtils.isValidFieldNameArray(arr, 0, 'nope')).toBeNull();
    });

    it('returns true when child has errors and touched', () => {
      const arr = fb.array([fb.group({ name: ['', Validators.required] })]);
      const child = (arr.at(0) as FormGroup).controls['name'];
      child.setErrors({ required: true });
      child.markAsTouched();
      expect(FormUtils.isValidFieldNameArray(arr, 0, 'name')).toBeTrue();
    });

    it('returns false when child has errors but not touched', () => {
      const arr = fb.array([fb.group({ name: ['', Validators.required] })]);
      const child = (arr.at(0) as FormGroup).controls['name'];
      child.setErrors({ required: true });
      expect(FormUtils.isValidFieldNameArray(arr, 0, 'name')).toBeFalse();
    });
  });

  describe('getFielErrorInArray', () => {
    it('returns null when index out of range', () => {
      const arr = fb.array([]);
      expect(FormUtils.getFielErrorInArray(arr, 0, 'a')).toBeNull();
    });

    it('returns null when child missing', () => {
      const arr = fb.array([fb.group({})]);
      expect(FormUtils.getFielErrorInArray(arr, 0, 'no')).toBeNull();
    });

    it('returns error text from child', () => {
      const arr = fb.array([fb.group({ title: [''], code: [''] })]);
      const child = (arr.at(0) as FormGroup).controls['title'];
      child.setErrors({ minlength: { requiredLength: 5, actualLength: 2 } });
      const txt = FormUtils.getFielErrorInArray(arr, 0, 'title');
      expect(txt).toBe('Min 5 characters');
    });
  });

  describe('getTextErrors', () => {
    it('handles required, minlength and invalidUrlFormat keys', () => {
      expect(FormUtils.getTextErrors({ required: true })).toBe(
        'This field is required'
      );
      expect(
        FormUtils.getTextErrors({ minlength: { requiredLength: 2 } })
      ).toBe('Min 2 characters');
      expect(FormUtils.getTextErrors({ invalidUrlFormat: true })).toBe(
        'Url format invalid'
      );
    });

    it('returns generic message for unknown error object', () => {
      const errors = { unknownErr: { info: 1 } };
      const out = FormUtils.getTextErrors(errors);
      expect(out).toContain('Validation error not controlled');
    });

    it('returns null for null/undefined errors', () => {
      expect(FormUtils.getTextErrors(null as any)).toBeNull();
      expect(FormUtils.getTextErrors(undefined as any)).toBeNull();
    });
  });
});
