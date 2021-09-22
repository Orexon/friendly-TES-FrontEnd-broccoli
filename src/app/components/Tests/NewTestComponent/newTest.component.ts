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
import { objectToFormData } from 'src/app/helpers/objectToFormData';
import { DownloadService } from 'src/app/services/download.service';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { HttpErrorResponse } from '@angular/common/http';

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
  selectedOption: string | StateType;
  solutionPaths: Array<string> = [];
  response: {
    success: boolean;
    msg: string;
  };
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
    private activatedroute: ActivatedRoute,
    private downloads: DownloadService
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
        .getEditTest(this.testId)
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
            Questions: x.questions.forEach((element) => {
              this.addQuestion();
              this.questionForm.patchValue({
                questionName: element.name,
                questionDescription: element.description,
                questionType: element.questionType,
                worthOfPoints: element.worthOfPoints,
              });
              this.addFilePath(element.solutionFilePath);
            }),
          })
        );
    }
  }

  compareFunction(o1: any, o2: any) {
    return o1 == o2; //works without type error.
    //return o1.key == o2.key && o1.value == o2.value; works with Null type error/warning.
  }

  getPath(num: number) {
    return this.solutionPaths[num];
  }

  addFilePath(path: string) {
    this.solutionPaths.push(path);
  }

  // convenience getters for easy access to form fields
  get f() {
    return this.testForm.controls;
  }

  get g() {
    return this.questionForm.controls;
  }

  get dateFromValue() {
    var localDate = this.testForm.controls['dateFrom'].value;
    return new Date(
      Date.UTC(
        localDate.getFullYear(),
        localDate.getMonth(),
        localDate.getDate(),
        localDate.getHours(),
        localDate.getMinutes(),
        localDate.getSeconds(),
        localDate.setSeconds(0)
      )
    );
  }

  get dateToValue() {
    var localDateTo = this.testForm.controls['dateTo'].value;
    return new Date(
      Date.UTC(
        localDateTo.getFullYear(),
        localDateTo.getMonth(),
        localDateTo.getDate(),
        localDateTo.getHours(),
        localDateTo.getMinutes(),
        localDateTo.getSeconds(),
        localDateTo.setSeconds(0)
      )
    );
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
    const object = this.createEditMap();

    const options = {
      indices: true,
    };

    const fd = objectToFormData(object, options);
    // after error display error on same page.

    this.testService
      .createTest(fd)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Test created successfully', {
            keepAfterRouteChange: true,
          });
          this.router.navigate(['/tests']);
        },
        error: (error) => {
          this.displayError(error);
          this.loading = false;
        },
      });
  }

  private editTest() {
    const object = this.createEditMap();

    const options = {
      indices: true,
    };

    const fd = objectToFormData(object, options);

    this.testService
      .editTest(this.testId, fd)
      .pipe(first())
      .subscribe({
        next: () => {
          this.alertService.success('Test edited successfully', {
            keepAfterRouteChange: true,
          });
          this.router.navigate(['/tests']);
        },
        error: (error) => {
          this.displayError(error);
          this.loading = false;
        },
      });
  }

  createEditMap() {
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

    if (this.isCreateMode) {
      const object = {
        name: this.f.name.value,
        description: this.f.description.value,
        questions: this.newQuestions,
        testType: this.f.enumSelect.value,
        validFrom: this.dateFromValue,
        validTo: this.dateToValue,
        timeLimit: this.f.hourInput.value * 60 + this.f.minutesInput.value,
      };
      return object;
    } else {
      const object = {
        id: this.testId.toString(),
        name: this.f.name.value,
        description: this.f.description.value,
        questions: this.newQuestions,
        testType: this.f.enumSelect.value,
        validFrom: this.dateFromValue,
        validTo: this.dateToValue,
        timeLimit: this.f.hourInput.value * 60 + this.f.minutesInput.value,
      };
      return object;
    }
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

  download(path: string): void {
    this.downloads.download(path).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'Solution';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}

// Validation for hours, both values can't be 0;
// update value when add/minus buttons - currently errors not changing after input.
// add to backend When test has answers. on edit create new test;
