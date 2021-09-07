import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { StateType } from 'src/app/models/testType';
import * as moment from 'moment';
import { ValidTime } from 'src/app/helpers/validTime.validator';
import { DateSelectionModelChange } from '@angular/material/datepicker';
import { HttpUploadProgressEvent } from '@angular/common/http';
import { QuestionType } from 'src/app/models/questionType';

@Component({
  templateUrl: 'newTest.component.html',
  styleUrls: ['newTest.component.css'],
})
export class NewTestComponent implements OnInit {
  testForm: FormGroup;
  questionForm: FormGroup;
  questions: FormArray;
  submitted = false;
  loading = false;
  isCreateMode: boolean;
  timeout: NodeJS.Timeout;
  public minDate: moment.Moment | Date | null;
  public timeLimit: Date;

  public TestEnum = Object.values(StateType).filter(
    (value) => typeof value !== 'number'
  );

  public QuestionEnum = Object.values(QuestionType).filter(
    (value) => typeof value !== 'number'
  );

  @ViewChild('hourInput') public hoursInputRef: ElementRef;
  @ViewChild('minutesInput') public minutesInputRef: ElementRef;
  @ViewChildren('pointsInput') public pointsInputRef: QueryList<ElementRef>;

  @ViewChild('hoursDecrementBtn') public hoursDecrementBtn: ElementRef;
  @ViewChild('hoursIncrementBtn') public hoursIncrementBtn: ElementRef;
  @ViewChild('minutesDecrementBtn') public minutesDecrementBtn: ElementRef;
  @ViewChild('minutesIncrementBtn') public minutesIncrementBtn: ElementRef;

  @ViewChildren('pointsDecrementBtn')
  public pointsDecrementBtn: QueryList<ElementRef>;
  @ViewChildren('pointsIncrementBtn')
  public pointsIncrementBtn: QueryList<ElementRef>;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit() {
    // this.id = this.data.userid;
    // this.isCreateMode = !this.id;
    // this.dialogTitle = this.data.dialogTitle;
    // this.confirmBtnTxt = this.data.confirmBtnTxt;
    console.log(this.pointsIncrementBtn);
    this._setMinDate();
    this.testForm = this.formBuilder.group(
      {
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        enumSelect: new FormControl(null, Validators.required),
        dateFrom: new FormControl(null, Validators.required),
        dateTo: new FormControl(null, Validators.required),
        hourInput: new FormControl(Number, [
          Validators.required,
          Validators.min(0),
          Validators.max(48),
        ]),
        minutesInput: new FormControl(Number, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
        questions: this.formBuilder.array([]),
      },
      {
        validator: ValidTime('dateFrom', 'dateTo'),
        //add custom validator to check if both time inputs are not 0.
        //add custom validator to check if all question points sum up less than 100
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

  get g() {
    return this.questionForm.controls;
  }

  get Questions() {
    return this.testForm.controls['questions'] as FormArray;
  }

  addQuestion() {
    this.questionForm = this.formBuilder.group({
      questionName: new FormControl('', Validators.required),
      questionDescription: new FormControl('', Validators.required),
      questionType: new FormControl(null, Validators.required),
      worthOfPoints: new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      // submittedSolution: new FormControl(null, Validators.required),
    });

    this.Questions.push(this.questionForm);
  }

  removeQuestion(i: number) {
    this.Questions.removeAt(i);
  }

  // getControls() {
  //   return (this.testForm.get('questions') as FormArray).controls;
  // }

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

  continuousIncrease(value: string, i?: number) {
    if (value === 'hours') {
      this.increment('hours');
      this.timeout = setInterval(() => {
        this.increment('hours');
      }, 200);
      return false;
    } else if (value === 'minutes') {
      this.increment('minutes');
      this.timeout = setInterval(() => {
        this.increment('minutes');
      }, 200);
      return false;
    } else {
      this.increment('points', i!);
      this.timeout = setInterval(() => {
        this.increment('points', i!);
      }, 150);
      return false;
    }
  }

  continuousDecrease(value: string, i?: number) {
    if (value === 'hours') {
      this.decrement('hours');
      this.timeout = setInterval(() => {
        this.decrement('hours');
      }, 200);
      return false;
    } else if (value === 'minutes') {
      this.decrement('minutes');
      this.timeout = setInterval(() => {
        this.decrement('minutes');
      }, 200);
      return false;
    } else {
      this.decrement('points', i!);
      this.timeout = setInterval(() => {
        this.decrement('points', i!);
      }, 150);
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

  increment(value: string, i?: number) {
    if (value === 'hours') {
      this.hoursInputRef.nativeElement.stepUp();
    } else if (value === 'minutes') {
      this.minutesInputRef.nativeElement.stepUp(5);
    } else {
      const ele = this.pointsInputRef.get(i!);
      ele!.nativeElement.stepUp();
    }
  }

  decrement(value: string, i?: number) {
    if (value === 'hours') {
      this.hoursInputRef.nativeElement.stepDown();
    } else if (value === 'minutes') {
      this.minutesInputRef.nativeElement.stepDown(5);
    } else {
      const ele = this.pointsInputRef.get(i!);
      ele!.nativeElement.stepDown();
    }
  }
}

//add to backend When test has answers. on edit create new test.
