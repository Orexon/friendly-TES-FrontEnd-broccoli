import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { TestType, StateType } from 'src/app/models/testType';

@Component({
  templateUrl: 'newTest.component.html',
  styleUrls: ['newTest.component.css'],
})
export class NewTestComponent implements OnInit {
  testForm: FormGroup;
  submitted = false;
  loading = false;
  isCreateMode: boolean;

  public stateTypes = Object.values(StateType).filter(
    (value) => typeof value === 'number'
  );

  public TestEnum = Object.values(StateType).filter(
    (value) => typeof value !== 'number'
  );

  // testType: TestType[] = [
  //   { value: 0, viewValue: 'C#' },
  //   { value: 1, viewValue: 'PHP' },
  //   { value: 2, viewValue: 'Mixed' },
  // ];

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    // this.id = this.data.userid;
    // this.isCreateMode = !this.id;
    console.log(this.TestEnum);
    // this.dialogTitle = this.data.dialogTitle;
    // this.confirmBtnTxt = this.data.confirmBtnTxt;

    this.testForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      testType: [Number, Validators.required],
    });
    // if (!this.isCreateMode) {
    //   this.userService
    //     .editAdmin(this.id)
    //     .pipe(first())
    //     .subscribe((x) =>
    //       this.adminForm.patchValue({
    //         username: x.username,
    //         email: x.email,
    //         firstname: x.firstname,
    //         lastname: x.lastname,
    //         id: x.id,
    //       })
    //     );
    // }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.testForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.testForm.invalid) {
      return;
    }
    this.loading = true;
    if (this.isCreateMode) {
      this.createTest();
    } else {
      this.editTest();
    }
  }

  private createTest() {
    // this.userService
    //   .createAdmin(this.adminForm.value)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       this.response = {
    //         success: true,
    //         msg: 'Admin has been created successfully',
    //       };
    //       this.dialogRef.close(this.response);
    //     },
    //     error: (error) => {
    //       this.response = {
    //         success: false,
    //         msg: error,
    //       };
    //       this.dialogRef.close(this.response);
    //       this.loading = false;
    //     },
    //   });
  }

  private editTest() {
    // const params = {
    //   id: this.id,
    //   username: this.f.username.value,
    //   email: this.f.email.value,
    //   firstname: this.f.firstname.value,
    //   lastname: this.f.lastname.value,
    //   password: this.f.password.value,
    //   confirmPassword: this.f.confirmPassword.value,
    // };
    // this.userService
    //   .editAdminPatch(this.id, params)
    //   .pipe(first())
    //   .subscribe({
    //     next: () => {
    //       this.response = {
    //         success: true,
    //         msg: 'Admin has been edited successfully',
    //       };
    //       this.dialogRef.close(this.response);
    //     },
    //     error: (error) => {
    //       this.response = {
    //         success: false,
    //         msg: error,
    //       };
    //       this.dialogRef.close(this.response);
    //       this.loading = false;
    //     },
    //   });
  }
}
