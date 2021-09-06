import { FormGroup } from '@angular/forms';

export function ValidTime(dateFromControl: string, dateToControl: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[dateFromControl];
    const matchingControl = formGroup.controls[dateToControl];

    if (matchingControl.errors && !matchingControl.errors.ValidTime) {
      // return if another validator has already found an error on the matchingControl
      return;
    }

    // set error on matchingControl if validation fails
    if (control.value > matchingControl.value) {
      matchingControl.setErrors({ ValidTime: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
