import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  Form,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { first } from 'rxjs/operators';
import { StateType } from 'src/app/models/testType';
import { ValidTime } from 'src/app/helpers/validTime.validator';
import { QuestionType } from 'src/app/models/questionType';
import { Guid } from 'guid-typescript';
import { TestService } from 'src/app/services/tests.service';
import { AlertService } from 'src/app/helpers/alert/alert.service';
import { NewTest } from 'src/app/models/newTest';
import { NewQuestion } from 'src/app/models/question';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { calculteTimeLimit } from 'src/app/helpers/timeLimitCalc';

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
  percentDone: any = 0;
  isCreateMode: boolean;
  timeout: NodeJS.Timeout;
  accept: string = '.txt';
  testId: Guid;
  newTest: NewTest;
  timeLimit: number;
  timeLimitObj: {
    days: number;
    hours: number;
    mins: number;
  };
  newQuestions: NewQuestion[] = [];
  newQuestion: NewQuestion;
  public minDate: Date;

  public TestEnum = Object.values(StateType).filter(
    (value) => typeof value !== 'number'
  );

  public QuestionEnum = Object.values(QuestionType).filter(
    (value) => typeof value !== 'number'
  );

  @ViewChild('hourInput') hoursInputRef: ElementRef;
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

  constructor(
    private formBuilder: FormBuilder,
    private testService: TestService,
    private alertService: AlertService,
    private router: Router,
    private activatedroute: ActivatedRoute
  ) {}
  ngOnInit() {
    if (this.router.url === '/tests/newTest') {
      this.isCreateMode = true;
    } else {
      this.isCreateMode = false;
      this.testId = Guid.parse(
        this.activatedroute.snapshot.paramMap.get('id')!
      );
    }

    this._setMinDate();

    this.testForm = this.formBuilder.group(
      {
        name: new FormControl('', Validators.required),
        description: new FormControl('', Validators.required),
        enumSelect: new FormControl(null, Validators.required),
        dateFrom: new FormControl(Date, Validators.required),
        dateTo: new FormControl(Date, Validators.required),
        hourInput: new FormControl(null, [
          Validators.required,
          Validators.min(0),
          Validators.max(48),
        ]),
        minutesInput: new FormControl(null, [
          Validators.required,
          Validators.min(0),
          Validators.max(59),
        ]),
        questions: this.formBuilder.array([], Validators.required),
      },
      {
        validator: ValidTime('dateFrom', 'dateTo'),
        //   //add custom validator to check if both time inputs are not 0.
        //   //add custom validator to check if all question points sum up less than 100
        //   //add custom validator for file checking.
      }
    );

    if (!this.isCreateMode) {
      this.testService
        .getTest(this.testId)
        .pipe(first())
        .subscribe((x) =>
          this.testForm.patchValue({
            name: x.name,
            description: x.description,
            enumSelect: x.testType,
            dateFrom: x.validFrom,
            dateTo: x.validTo,
            hourInput: calculteTimeLimit(x.timeLimit).totalHours,
            minutesInput: calculteTimeLimit(x.timeLimit).mins,
            Questions: x.questions,
          })
        );
    }
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.testForm.controls;
  }

  get g() {
    return this.questionForm.controls;
  }

  get dateFromValue() {
    return this.testForm.controls['dateFrom'].value;
  }
  get dateToValue() {
    return this.testForm.controls['dateTo'].value;
  }

  get Questions() {
    return this.testForm.controls['questions'] as FormArray;
  }

  addQuestion() {
    this.questionForm = this.formBuilder.group({
      questionName: new FormControl('', Validators.required),
      questionDescription: new FormControl('', Validators.required),
      questionType: new FormControl(null, Validators.required),
      worthOfPoints: new FormControl(null, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
      ]),
      SubmittedSolution: new FormControl(null, [Validators.required]),
    });

    this.Questions.push(this.questionForm);
  }

  removeQuestion(i: number) {
    this.Questions.removeAt(i);
  }

  private _setMinDate() {
    const now = new Date();
    this.minDate = new Date();
    this.minDate.setDate(now.getDate());
  }

  onSelectFile(fileInput: any, i: number) {}

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
    for (let i = 0; i < this.Questions?.controls.length; i++) {
      this.newQuestion = {
        name: this.Questions?.controls[i].get('questionName')?.value,
        description: this.Questions?.controls[i].get('questionDescription')
          ?.value,
        questionType: this.Questions?.controls[i].get('questionType')?.value,
        SubmittedSolution:
          this.Questions?.controls[i].get('SubmittedSolution')?.value,
        worthOfPoints: this.Questions?.controls[i].get('worthOfPoints')?.value,
      };
      this.newQuestions.push(this.newQuestion);
    }

    const object = {
      name: this.f.name.value,
      description: this.f.description.value,
      questions: this.newQuestions,
      testType: this.f.enumSelect.value,
      validFrom: this.dateFromValue,
      validTo: this.dateToValue,
      timeLimit: this.f.hourInput.value * 60 + this.f.minutesInput.value,
    };

    console.log(object.timeLimit);

    const options = {
      indices: true,
    };

    const fd = this.objectToFormData(object, options);
    // after error display error on same page.

    this.testService
      .createTest(fd)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Test Created');
          this.router.navigate(['/tests']);
        },
        error: (error) => {
          this.displayError(error.message);
          this.loading = false;
        },
      });
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

  //test here
  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }

  clear() {
    clearInterval(this.timeout);
    return false;
  }

  clearleave() {
    clearInterval(this.timeout);
    return false;
  }

  oldValToNew(name: string, i?: number) {
    if (name === 'hours') {
      var newVal = this.hoursInputRef.nativeElement.value;
      this.f.hourInput.setValue(Number(newVal));
    } else if (name === 'minutes') {
      var newVal = this.minutesInputRef.nativeElement.value;
      this.f.minutesInput.setValue(Number(newVal));
    } else {
      const ele = this.pointsInputRef.get(i!);
      var newVal = ele?.nativeElement.value;
      var eleCtrl = this.Questions.controls[i!].get('worthOfPoints');
      eleCtrl?.setValue(Number(newVal));
    }
  }

  increment(name: string, i?: number) {
    if (name === 'hours') {
      this.hoursInputRef.nativeElement.stepUp();
      this.oldValToNew('hours');
    } else if (name === 'minutes') {
      this.minutesInputRef.nativeElement.stepUp(5);
      this.oldValToNew('minutes');
    } else {
      const ele = this.pointsInputRef.get(i!);
      ele!.nativeElement.stepUp();
      this.oldValToNew('points', i);
    }
  }

  decrement(name: string, i?: number) {
    if (name === 'hours') {
      this.hoursInputRef.nativeElement.stepDown();
    } else if (name === 'minutes') {
      this.minutesInputRef.nativeElement.stepDown(5);
    } else {
      const ele = this.pointsInputRef.get(i!);
      ele!.nativeElement.stepDown();
      this.oldValToNew('points', i);
    }
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

  isUndefined = (value: any) => value === undefined;

  isNull = (value: any) => value === null;

  isBoolean = (value: any) => typeof value === 'boolean';

  isObject = (value: any) => value === Object(value);

  isArray = (value: any) => Array.isArray(value);

  isDate = (value: any) => value instanceof Date;

  isBlob = (value: any) =>
    value &&
    typeof value.size === 'number' &&
    typeof value.type === 'string' &&
    typeof value.slice === 'function';

  isFile = (value: any) =>
    this.isBlob(value) &&
    typeof value.name === 'string' &&
    (typeof value.lastModifiedDate === 'object' ||
      typeof value.lastModified === 'number');

  objectToFormData = (obj: any, cfg?: any, fd?: any, pre?: any) => {
    cfg = cfg || {};

    cfg.indices = this.isUndefined(cfg.indices) ? false : cfg.indices;

    cfg.nullsAsUndefineds = this.isUndefined(cfg.nullsAsUndefineds)
      ? false
      : cfg.nullsAsUndefineds;

    cfg.booleansAsIntegers = this.isUndefined(cfg.booleansAsIntegers)
      ? false
      : cfg.booleansAsIntegers;

    fd = fd || new FormData();

    if (this.isUndefined(obj)) {
      return fd;
    } else if (this.isNull(obj)) {
      if (!cfg.nullsAsUndefineds) {
        fd.append(pre, '');
      }
    } else if (this.isBoolean(obj)) {
      if (cfg.booleansAsIntegers) {
        fd.append(pre, obj ? 1 : 0);
      } else {
        fd.append(pre, obj);
      }
    } else if (this.isArray(obj)) {
      if (obj.length) {
        obj.forEach((value: any, index: any) => {
          const key = pre + '[' + (cfg.indices ? index : '') + ']';

          this.objectToFormData(value, cfg, fd, key);
        });
      }
    } else if (this.isDate(obj)) {
      fd.append(pre, obj.toISOString());
    } else if (this.isObject(obj) && !this.isFile(obj) && !this.isBlob(obj)) {
      Object.keys(obj).forEach((prop) => {
        const value = obj[prop];

        if (this.isArray(value)) {
          while (
            prop.length > 2 &&
            prop.lastIndexOf('[]') === prop.length - 2
          ) {
            prop = prop.substring(0, prop.length - 2);
          }
        }
        const key = pre ? pre + '.' + prop : prop;

        this.objectToFormData(value, cfg, fd, key);
      });
    } else {
      fd.append(pre, obj);
    }

    return fd;
  };
}

// Validation for hours, both values can't be 0;
// update value when add/minus buttons - currently errors not changing after input.
// add to backend When test has answers. on edit create new test.
