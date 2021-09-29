import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Guid } from 'guid-typescript';
import { AlertService } from 'src/app/helpers/alert/alert.service';
import { ResultInfo } from 'src/app/models/resultsInfo';
import { TestResultDto } from 'src/app/models/testResultDto';
import { ResultsService } from 'src/app/services/results.service';
import { ResultInfoDialogComponent } from '../ResultInfoDialogComponent/result-info-dialog.component';

@Component({
  selector: 'app-test-results',
  templateUrl: './test-results.component.html',
  styleUrls: ['./test-results.component.css'],
})
export class TestResultsComponent implements OnInit {
  loading: boolean = false;
  testId: Guid;
  results: TestResultDto[];
  resultInfo: ResultInfo;
  testName: string;
  displayedColumns: string[] = [
    'Name',
    'Applicant Email',
    'Points Scored',
    'Minutes Overtime',
    'actions',
  ];

  public dataSource = new MatTableDataSource<TestResultDto>();
  private dataArray: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private resultService: ResultsService,
    private alertService: AlertService,
    private activatedroute: ActivatedRoute,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.testId = Guid.parse(this.activatedroute.snapshot.paramMap.get('id')!);

    this.resultService.getTestResults(this.testId).subscribe(
      (res) => {
        this.loading = false;
        this.results = res;
        this.testName = this.results[0].testName;
        this.dataArray = res;
        this.dataSource = new MatTableDataSource(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: string) => {
        this.displayError(err);
        this.loading = false;
      }
    );
  }

  openResultInfo(testId: Guid, applicantId: Guid) {
    this.alertService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = '60vw';

    this.resultService.getResultDetails(testId, applicantId).subscribe(
      (res) => {
        this.loading = false;
        this.resultInfo = res;

        dialogConfig.data = {
          dialogTitle: 'Test "' + this.resultInfo.testName + '" information',
          fullName: this.resultInfo.firstName + ' ' + this.resultInfo.lastName,
          email: this.resultInfo.email,
          testTotalPoints: this.resultInfo.totalPoints,
          minutesOvertime: this.resultInfo.minutesOvertime,
          startedAt: this.resultInfo.startedAt,
          resultQuestions: this.resultInfo.questionResults,
        };

        let dialogRef = this.matDialog.open(
          ResultInfoDialogComponent,
          dialogConfig
        );
      },
      (err: string) => {
        this.displayError(err);
        this.loading = false;
      }
    );
  }

  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }
}
