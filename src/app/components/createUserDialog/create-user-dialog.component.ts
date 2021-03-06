import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { MustMatch } from 'src/app/helpers/mustMatch.validator';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from 'src/app/helpers/alert/alert.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { User } from 'src/app/models/user';
import { Guid } from 'guid-typescript';

@Component({
  selector: 'app-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.css'],
})
export class CreateUserDialogComponent implements OnInit {
  adminForm: FormGroup;
  id: Guid;
  loading = false;
  submitted = false;
  isCreateMode: boolean;
  dialogTitle: string;
  confirmBtnTxt: string;
  response: {
    success: boolean;
    msg: string;
  };

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CreateUserDialogComponent>,
    private userService: UserService,
    private alertService: AlertService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.id = this.data.userid;
    this.isCreateMode = !this.id;

    this.dialogTitle = this.data.dialogTitle;
    this.confirmBtnTxt = this.data.confirmBtnTxt;

    this.adminForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        firstname: ['', [Validators.required, Validators.maxLength(50)]],
        lastname: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.minLength(6),
            Validators.maxLength(30),
            this.isCreateMode ? Validators.required : Validators.nullValidator,
          ],
        ],
        confirmPassword: [''],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    if (!this.isCreateMode) {
      this.userService
        .editAdmin(this.id)
        .pipe(first())
        .subscribe((x) =>
          this.adminForm.patchValue({
            username: x.username,
            email: x.email,
            firstname: x.firstname,
            lastname: x.lastname,
            id: x.id,
          })
        );
    }
  }

  checkPasswords: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let pass = group.get('password')?.value;
    let confirmPass = group.get('confirmPassword')?.value;
    return pass === confirmPass ? null : { notSame: true };
  };

  // convenience getter for easy access to form fields
  get f() {
    return this.adminForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // reset alerts on submit
    // this.alertService.clear();

    // stop here if form is invalid
    if (this.adminForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.isCreateMode) {
      this.createAdmin();
    } else {
      this.editAdmin();
    }
  }

  private createAdmin() {
    this.userService
      .createAdmin(this.adminForm.value)
      .pipe(first())
      .subscribe({
        next: () => {
          this.response = {
            success: true,
            msg: 'Admin has been created successfully',
          };
          this.dialogRef.close(this.response);
        },
        error: (error) => {
          this.response = {
            success: false,
            msg: error,
          };
          this.dialogRef.close(this.response);
          this.loading = false;
        },
      });
  }

  private editAdmin() {
    const params = {
      id: this.id,
      username: this.f.username.value,
      email: this.f.email.value,
      firstname: this.f.firstname.value,
      lastname: this.f.lastname.value,
      password: this.f.password.value,
      confirmPassword: this.f.confirmPassword.value,
    };

    this.userService
      .editAdminPatch(this.id, params)
      .pipe(first())
      .subscribe({
        next: () => {
          this.response = {
            success: true,
            msg: 'Admin has been edited successfully',
          };
          this.dialogRef.close(this.response);
        },
        error: (error) => {
          this.response = {
            success: false,
            msg: error,
          };
          this.dialogRef.close(this.response);
          this.loading = false;
        },
      });
  }
}
