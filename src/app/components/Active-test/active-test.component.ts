import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';
import { AlertService } from 'src/app/helpers/alert/alert.service';
import { ActiveTest } from 'src/app/models/activeTest';
import { QuestionList } from 'src/app/models/question';
import { ActiveTestService } from 'src/app/services/activeTest.service';

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
  submitted = false;
  testId: Guid;
  testLinkId: Guid;
  testData: ActiveTest;
  userForm: FormGroup;
  questionSolutionForm: FormGroup;
  questionList: QuestionList[] | undefined;
  testActive: boolean = false;
  fileName: string;
  selectedFile: File;
  email: string;

  @ViewChild('fileInput') fileInput: ElementRef;

  private subs = new Subscription();

  constructor(
    private activeTestService: ActiveTestService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService
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
      SubmittedSolution: new FormControl(null, [Validators.required]),
    });
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
        this.timeLimit = this.testData.timeLimit;
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
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = event.target.files[0];
      this.fileName = file.name;
    }
  }

  questionSolutionSubmit(questionId: Guid) {
    const params = {
      SubmittedSolution: this.selectedFile,
      TestId: this.testId,
      Email: this.email,
      QuestionId: this.testId,
    };

    // this.activeTestService.submitUserSolution(this.testId, params).subscribe(
    //   (res) => {
    //     // this.testData = res;
    //     this.testActive = true;
    //   },
    //   (err: string) => {
    //     this.displayError(err);
    //     this.loading = false;
    //   }
    // );
  }

  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }
}
