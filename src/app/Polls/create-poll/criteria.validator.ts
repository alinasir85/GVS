import {AbstractControl, ValidatorFn} from '@angular/forms';

export function criteriaValidator(regexp: RegExp): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value;
    let valid = true;
    if (value === null || value === '') {
      return null;
    } else {
    const email = value.replace(/\n/g, ',');
    const emails = email.split(',');
    console.log(emails);
    for (let i = 0; i < emails.length; i++) {
      if (!regexp.test(emails[i].replace(/\s/g, ''))) {
        valid = false;
      }
    } }
    return valid ? { 'patternInvalid': true } : null;
  };
}
