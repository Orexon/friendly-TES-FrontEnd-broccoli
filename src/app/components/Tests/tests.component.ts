import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { AlertService } from '../../helpers/alert/alert.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../createUserDialog/create-user-dialog.component';
import { Guid } from 'guid-typescript';
import { ConfirmationDialogComponent } from '../confirmationDialog/confirmation-dialog.component';
import { first } from 'rxjs/operators';
import { Test } from 'src/app/models/test';
import { TestService } from 'src/app/services/tests.service';

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
    private matDialog: MatDialog
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
      this.alertService.clear();
    }
  }
}
