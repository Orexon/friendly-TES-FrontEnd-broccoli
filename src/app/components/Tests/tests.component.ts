import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AlertService } from '../../helpers/alert/alert.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Guid } from 'guid-typescript';
import { ConfirmationDialogComponent } from '../confirmationDialog/confirmation-dialog.component';
import { first } from 'rxjs/operators';
import { Test } from 'src/app/models/test';
import { TestService } from 'src/app/services/tests.service';
import { TestInfoDialogComponent } from './TestInfoDialogComponent/test-info-dialog.component';
import { Router } from '@angular/router';
import { calculteTimeLimit } from 'src/app/helpers/timeLimitCalc';

@Component({
  templateUrl: 'tests.component.html',
  styleUrls: ['tests.component.css'],
})
export class TestsComponent implements OnInit, OnDestroy {
  tests: Test[] = [];
  dialogTitle: string;
  dialogMessage: string;
  confirmBtnTxt: string;
  cancelBtnTxt: string;
  loading: boolean = false;
  testInfo: Test;
  testData: Test;
  response: {
    success: boolean;
    msg: string;
  };

  displayedColumns: string[] = [
    'name',
    'validFrom',
    'validTo',
    'testlink',
    'actions',
  ];
  public dataSource = new MatTableDataSource<User>();
  private subs = new Subscription();
  private dataArray: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private testService: TestService,
    private alertService: AlertService,
    private matDialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit() {
    this.loading = true;
    this.subs.add(
      this.testService.getAllTests().subscribe(
        (res) => {
          this.loading = false;
          this.dataArray = res;
          this.dataSource = new MatTableDataSource(this.dataArray);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        (error: string) => {
          this.displayError(error);
          this.loading = false;
        }
      )
    );
  }

  refresh() {
    this.testService.getAllTests().subscribe(
      (res) => {
        this.loading = false;
        this.dataArray = res;
        this.dataSource = new MatTableDataSource(this.dataArray);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res);
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

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }

  openTestInfo(id: Guid) {
    this.alertService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.maxWidth = '60vw';

    this.testService.getTest(id).subscribe(
      (res) => {
        this.loading = false;
        this.testInfo = res;

        dialogConfig.data = {
          dialogTitle: 'Test "' + this.testInfo.name + '" information',
          description: this.testInfo.description,
          questions: this.testInfo.questions,
          testType: this.testInfo.testType,
          createTime: this.testInfo.createTime,
          validFrom: this.testInfo.validFrom,
          validTo: this.testInfo.validTo,
          timeLimit: calculteTimeLimit(this.testInfo.timeLimit),
          testLink: this.testInfo.urlLinkId,
        };

        let dialogRef = this.matDialog.open(
          TestInfoDialogComponent,
          dialogConfig
        );
      },
      (err: string) => {
        this.displayError(err);
        this.loading = false;
      }
    );
  }

  editTest(id: Guid) {
    this.alertService.clear();
    this.testService.getEditTest(id).subscribe(
      (res) => {
        this.router.navigate(['/tests/editTest', id]);
      },
      (err: string) => {
        this.displayError(err);
        this.loading = false;
      }
    );
  }

  openDeleteModal(id: Guid) {
    this.alertService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = 300;

    dialogConfig.data = {
      dialogMessage: 'Are you sure?',
      confirmBtnTxt: 'Yes',
      cancelBtnTxt: 'Cancel',
    };

    let dialogRef = this.matDialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.testService
          .deleteTest(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.refresh();
              this.alertService.success('Test has been deleted successfully');
            },
            error: (error) => {
              this.displayError(error);
              this.loading = false;
            },
          });
      }
    });
  }
}
