import { Component, OnInit, ViewChild, OnDestroy, Inject } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { AlertService } from '../../helpers/alert/alert.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CreateUserDialogComponent } from '../createUserDialog/create-user-dialog.component';
import { Guid } from 'guid-typescript';
import { ConfirmationDialogComponent } from '../confirmationDialog/confirmation-dialog.component';
import { first } from 'rxjs/operators';

@Component({
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  users: User[] = [];
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
    'userName',
    'email',
    'firstname',
    'lastname',
    'actions',
  ];
  public dataSource = new MatTableDataSource<User>();
  private subs = new Subscription();
  private dataArray: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private userService: UserService,
    private alertService: AlertService,
    private matDialog: MatDialog
  ) {}

  ngOnInit() {
    this.loading = true;
    this.subs.add(
      this.userService.getAll().subscribe(
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
    this.userService.getAll().subscribe(
      (res) => {
        this.loading = false;
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

  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
      this.alertService.clear();
    }
  }

  openEditCreateAdmin(id?: Guid) {
    this.alertService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = 300;
    dialogConfig.minHeight = 490;
    dialogConfig.maxHeight = '90vh';
    dialogConfig.maxWidth = '90vw';

    if (id) {
      this.dialogTitle = 'Edit Admin';
      this.confirmBtnTxt = 'Update';
      dialogConfig.data = {
        userid: id,
        dialogTitle: this.dialogTitle,
        confirmBtnTxt: this.confirmBtnTxt,
      };
    } else {
      this.dialogTitle = 'Create new Admin';
      this.confirmBtnTxt = 'Create';
      dialogConfig.data = {
        dialogTitle: this.dialogTitle,
        confirmBtnTxt: this.confirmBtnTxt,
      };
    }

    let dialogRef = this.matDialog.open(
      CreateUserDialogComponent,
      dialogConfig
    );

    dialogRef
      .afterClosed()
      .subscribe((response: { success: boolean; msg: string }) => {
        console.log(response);
        if (response.success) {
          this.refresh();
          this.alertService.success(response.msg);
        } else {
          this.alertService.error(response.msg);
        }
      });
  }

  openDeleteModal(id: Guid) {
    this.alertService.clear();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.minWidth = 300;

    this.dialogMessage = 'Are you sure?';
    this.confirmBtnTxt = 'Yes';
    this.cancelBtnTxt = 'Cancel';

    dialogConfig.data = {
      dialogMessage: this.dialogMessage,
      confirmBtnTxt: this.confirmBtnTxt,
      cancelBtnTxt: this.cancelBtnTxt,
    };

    let dialogRef = this.matDialog.open(
      ConfirmationDialogComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService
          .deleteAdmin(id)
          .pipe(first())
          .subscribe({
            next: () => {
              this.refresh();
              this.alertService.success('Admin has been deleted successfully');
            },
            error: (error) => {
              this.alertService.error(error);
              this.loading = false;
            },
          });
      }
    });
  }
}
