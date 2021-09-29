import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Guid } from 'guid-typescript';
import { Subscription } from 'rxjs';
import { AlertService } from 'src/app/helpers/alert/alert.service';
import { Result } from 'src/app/models/result';
import { ResultInfo } from 'src/app/models/resultsInfo';
import { ResultsService } from 'src/app/services/results.service';
import { ResultInfoDialogComponent } from './ResultInfoDialogComponent/result-info-dialog.component';

@Component({
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  resultInfo: ResultInfo;
  dialogTitle: string;

  displayedColumns: string[] = [
    'Applicant Email',
    'Test Name',
    'Total Points',
    'Question Count',
    'Overtime',
    'actions',
  ];

  public dataSource = new MatTableDataSource<Result>();
  private subs = new Subscription();
  private dataArray: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private resultService: ResultsService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true;

    this.subs.add(
      this.resultService.getAllResults().subscribe(
        (res) => {
          this.loading = false;
          this.dataArray = res;
          this.dataSource = new MatTableDataSource(this.dataArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (err: HttpErrorResponse) => {
          this.displayError(err.message);
          this.loading = false;
        }
      )
    );
  }

  refresh() {
    this.resultService.getAllResults().subscribe(
      (res) => {
        this.loading = false;
        this.dataArray = res;
        this.dataSource = new MatTableDataSource(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (err: HttpErrorResponse) => {
        this.displayError(err.message);
        this.loading = false;
      }
    );
  }

  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
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

  openTestResults() {
    //this.subs.add(this.resultService.getTestResults().subscribe());
    // Get all Results from A specific test. Get Questions from a specific test.
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
