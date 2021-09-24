import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import {
  CountdownComponent,
  CountdownConfig,
  CountdownEvent,
} from 'ngx-countdown';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/helpers/alert/alert.service';
import { objectToFormData } from 'src/app/helpers/objectToFormData';
import { calculateTimeLimit } from 'src/app/helpers/timeLimitCalc';
import { ActiveTest } from 'src/app/models/activeTest';
import { QuestionList } from 'src/app/models/question';
import { ActiveTestService } from 'src/app/services/activeTest.service';

const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

@Component({
  selector: 'app-active-test',
  templateUrl: './active-test.component.html',
  styleUrls: ['./active-test.component.css'],
})
export class ActiveTestComponent implements OnInit {
  loading: boolean = false;
  testName: string;
  testDescription: string;
  ValidFrom: Date;
  ValidTo: Date;
  timeLimit: BigInt;
  countdownTime: number;
  submitted = false;
  testId: Guid;
  testLinkId: Guid;
  testData: ActiveTest;
  userForm: FormGroup;
  questionSolutionForm: FormGroup;
  solutionForm: FormGroup;
  questionList: QuestionList[] | undefined;
  testActive: boolean = false;
  fileName: string;
  selectedFile: File;
  email: string;
  config: CountdownConfig;
  notify: string = '';
  accept: string = '.cs';

  @ViewChild('fileInput') fileInput: ElementRef;
  @ViewChild('cd') countdown: CountdownComponent;

  private subs = new Subscription();

  constructor(
    private activeTestService: ActiveTestService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loading = true;

    if (this.activatedroute.snapshot.paramMap.get('id') != null || undefined) {
      this.testLinkId = Guid.parse(
        this.activatedroute.snapshot.paramMap.get('id')!
      );
    } else {
      //   redirect
    }

    this.subs.add(
      this.activeTestService.activeTest(this.testLinkId).subscribe(
        (res) => {
          this.loading = false;
          this.testData = res;
          this.testId = this.testData.id;
          this.testName = this.testData.name;
          this.testDescription = this.testData.description;
          this.ValidFrom = this.testData.validFrom;
          this.ValidTo = this.testData.validTo;
          this.timeLimit = this.testData.timeLimit;
        },
        (err: HttpErrorResponse) => {
          this.displayError(err.message);
          this.loading = false;
        }
      )
    );

    this.userForm = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      firstName: new FormControl('', [Validators.required]),
      lastName: new FormControl('', [Validators.required]),
    });

    this.questionSolutionForm = this.formBuilder.group({
      SubmittedSolution: this.formBuilder.array(
        [
          this.formBuilder.group({
            SubmittedSolution: new FormControl(null, [Validators.required]),
          }),
        ],
        Validators.required
      ),
    });
  }

  get SubmittedSolution() {
    return this.questionSolutionForm.controls['SubmittedSolution'] as FormArray;
  }

  addSolution() {
    this.solutionForm = this.formBuilder.group({
      SubmittedSolution: new FormControl(null, [Validators.required]),
    });

    this.SubmittedSolution.push(this.solutionForm);
  }

  get f() {
    return this.userForm.controls;
  }

  get q() {
    return this.questionSolutionForm.controls;
  }

  startTest() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }

    this.loading = true;

    const params = {
      email: this.f.email.value,
      firstName: this.f.firstName.value,
      lastName: this.f.lastName.value,
      id: this.testId,
    };

    this.activeTestService
      .activeTestStart(params, this.testId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.email = this.f.email.value;
          this.activateTest(this.testId);
        },
        error: (error) => {
          console.log(error);
          this.displayError(error);
          this.loading = false;
        },
      });
  }

  activateTest(id: Guid) {
    this.activeTestService.activeTestQuestion(id).subscribe(
      (res) => {
        this.testData = res;
        console.log(this.testData);
        this.questionList = this.testData.questions;

        // for (let index = 0; index < this.questionList!.length; index++) {
        //   this.addSolution();
        // }

        this.timeLimit = this.testData.timeLimit;
        this.countdownTime = calculateTimeLimit(this.timeLimit).totalSeconds;
        this.setCountdown(this.countdownTime);
        this.testActive = true;
      },
      (err: string) => {
        console.log(err);
        this.displayError(err);
        this.loading = false;
      }
    );
  }

  onFileSelected(event: any) {
    // const file: File = event.target.files[0];
    // if (file) {
    //   this.selectedFile = event.target.files[0];
    //   this.fileName = file.name;
    // }
  }

  get Solutions() {
    return this.questionSolutionForm.controls['SubmittedSolution'] as FormArray;
  }

  questionSolutionSubmit(questionId: Guid) {
    const params = {
      TestId: this.testId,
      Email: this.email,
      SubmittedSolution:
        this.questionSolutionForm.controls['SubmittedSolution'].value,
      QuestionId: questionId,
    };

    console.log(params);
    const options = {
      indices: true,
    };

    const fd = objectToFormData(params, options);

    this.activeTestService.submitUserSolution(this.testId, params).subscribe(
      (res) => {
        this.alertService.success('Solution Submited', res);
        this.testActive = true;
      },
      (err: string) => {
        this.displayError(err);
        this.loading = false;
      }
    );
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action);
  }

  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }

  setCountdown(time: number) {
    this.notify = '';
    this.config = {
      leftTime: time,
      notify: [time / 2, time / 3, time - 10],
      formatDate: ({ date, formatStr }) => {
        let duration = Number(date || 0);

        return CountdownTimeUnits.reduce((current, [name, unit]) => {
          if (current.indexOf(name) !== -1) {
            const v = Math.floor(duration / unit);
            duration -= v * unit;
            return current.replace(
              new RegExp(`${name}+`, 'g'),
              (match: string) => {
                return v.toString().padStart(match.length, '0');
              }
            );
          }
          return current;
        }, formatStr);
      },
    };
  }

  handleEvent(e: CountdownEvent) {
    this.notify = e.action.toUpperCase();
    if (e.action === 'notify') {
      var leftMin = Math.round(e.left / 1000 / 60);
      this.notify = `${leftMin} minutes left`;
    }
    this.openSnackBar(this.notify, 'ok');
  }
}
