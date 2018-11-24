import { AbstractControl } from '@angular/forms';
export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('fieldPassword').value; // to get value in input tag
    const confirmPassword = AC.get('fieldConfirmPassword').value; // to get value in input tag
    if (password !== confirmPassword) {
      AC.get('fieldConfirmPassword').setErrors({ MatchPassword: true });
    } else {
      return null;
    }
  }
}
