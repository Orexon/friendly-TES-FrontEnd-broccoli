// import { FormControl } from '@angular/forms';

// export function requiredFileType(type: string) {
//   return function (control: FormControl) {
//     const file = control.value;
//     if (file) {
//       const extension = file.name.split('.')[1].toLowerCase();
//       if (type.toLowerCase() !== extension.toLowerCase()) {
//         return {
//           requiredFileType: true,
//         };
//       }

//       return null;
//     }

//     return null;
//   };
// }

import { ValidatorFn, AbstractControl } from '@angular/forms';

export function requiredFileType(validExt: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    let forbidden = true;
    if (control.value) {
      const fileExt = control.value.split('.').pop();
      validExt.split(',').forEach((ext) => {
        if (ext.trim() == fileExt) {
          forbidden = false;
        }
      });
    }
    return forbidden ? { inValidExt: true } : null;
  };
}
