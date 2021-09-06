import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { StateType } from 'src/app/models/testType';
import * as moment from 'moment';
import { ValidTime } from 'src/app/helpers/validTime.validator';
import { DateSelectionModelChange } from '@angular/material/datepicker';
import { HttpUploadProgressEvent } from '@angular/common/http';

@Component({
  templateUrl: 'newTest.component.html',
  styleUrls: ['newTest.component.css'],
})
export class NewTestComponent implements OnInit {
  testForm: FormGroup;
  submitted = false;
  loading = false;
  isCreateMode: boolean;
  timeout: NodeJS.Timeout;
  public minDate: moment.Moment | Date | null;
  public timeLimit: Date;

  public TestEnum = Object.values(StateType).filter(
    (value) => typeof value !== 'number'
  );

  @ViewChild('hourInput') public hoursInputRef: ElementRef;
  @ViewChild('minutesInput') public minutesInputRef: ElementRef;

  @ViewChild('hoursDecrementBtn') public hoursDecrementBtn: ElementRef;
  @ViewChild('hoursIncrementBtn') public hoursIncrementBtn: ElementRef;
  @ViewChild('minutesDecrementBtn') public minutesDecrementBtn: ElementRef;
  @ViewChild('minutesIncrementBtn') public minutesIncrementBtn: ElementRef;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    // this.id = this.data.userid;
    // this.isCreateMode = !this.id;
    // this.dialogTitle = this.data.dialogTitle;
    // this.confirmBtnTxt = this.data.confirmBtnTxt;

    this._setMinDate();

    this.testForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        description: ['', Validators.required],
        enumSelect: [null, Validators.required],
        dateFrom: [null, Validators.required],
        dateTo: [null, Validators.required],
        hourInput: [
          Number,
          [Validators.required, Validators.min(0), Validators.max(48)],
        ],
        minutesInput: [
          Number,
          [Validators.required, Validators.min(0), Validators.max(59)],
        ],
      },
      {
        validator: ValidTime('dateFrom', 'dateTo'),
      }
    );
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

  private _setMinDate() {
    const now = new Date();
    this.minDate = new Date();
    this.minDate.setDate(now.getDate());
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

  continuousIncrease(value: string) {
    if (value === 'hours') {
      this.increment('hours');
      this.timeout = setInterval(() => {
        this.increment('hours');
      }, 250);
      return false;
    } else {
      this.increment('minutes');
      this.timeout = setInterval(() => {
        this.increment('minutes');
      }, 250);
      return false;
    }
  }

  continuousDecrease(value: string) {
    if (value === 'hours') {
      this.decrement('hours');
      this.timeout = setInterval(() => {
        this.decrement('hours');
      }, 250);
      return false;
    } else {
      this.decrement('minutes');
      this.timeout = setInterval(() => {
        this.decrement('minutes');
      }, 250);
      return false;
    }
  }

  clear() {
    clearInterval(this.timeout);
    return false;
  }

  clearleave() {
    clearInterval(this.timeout);
    return false;
  }

  increment(value: string) {
    if (value === 'hours') {
      this.hoursInputRef.nativeElement.stepUp();
    } else {
      this.minutesInputRef.nativeElement.stepUp(5);
    }
  }
  decrement(value: string) {
    if (value === 'hours') {
      this.hoursInputRef.nativeElement.stepDown();
    } else {
      this.minutesInputRef.nativeElement.stepDown(5);
    }
  }
}

//add to backend When test has answers. on edit create new test.
