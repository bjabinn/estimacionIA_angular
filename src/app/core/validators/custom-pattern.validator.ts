import { AbstractControl, FormGroup, ValidationErrors } from '@angular/forms';
import { VALID_CHARACTERS_REGEX } from '@core/constants/general.const';

export function customPatternValidator(
  control: AbstractControl
): ValidationErrors | null {
  const value = control.value || '';
  const pattern = VALID_CHARACTERS_REGEX;
  return pattern.test(value) ? null : { invalidPattern: true };
}
