import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormControlsService {
  constructor() {}

  //ErrorHandler en caso de ser requerido
  hasFormError(input: string, error: string, formG: FormGroup): boolean {
    const control = formG.get(input);
    let resp = control?.hasError(error) && (control.touched || control.dirty);
    return resp ?? false;
  }
}
