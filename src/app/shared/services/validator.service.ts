import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {
  constructor() {}
  public isValidField(myForm: FormGroup, field: string): boolean | null {
    return myForm.controls[field].errors && myForm.controls[field].touched;
  }

  getFieldError(myForm: FormGroup, field: string): string | null {
    if (!myForm.controls[field]) return null;

    const errors = myForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es necesario';

        case 'minlength':
          return `Minimo ${errors['minlength'].requiredLength} caracteres`;

        case 'pattern':
          if (field === 'phone') {
            return 'Invalid phone number format';
          }
          return 'Email No Valido';
      }
    }

    return null;
  }
}
