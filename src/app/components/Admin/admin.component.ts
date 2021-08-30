import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { first } from 'rxjs/operators';
import { AlertService } from '../../helpers/alert/alert.service';

@Component({
  templateUrl: 'admin.component.html',
  styleUrls: ['admin.component.css'],
})
export class AdminComponent implements OnInit, OnDestroy {
  users: User[] = [];
  loading: boolean = false;
  displayedColumns: string[] = [
    'userName',
    'email',
    'firstName',
    'lastName',
    'actions',
  ];
  public dataSource = new MatTableDataSource<User>();
  private subs = new Subscription();
  private dataArray: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private userService: UserService,
    private alertService: AlertService
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

  private displayError(message: string) {
    this.alertService.error(message, { autoClose: false });
  }

  ngOnDestroy() {
    if (this.subs) {
      this.subs.unsubscribe();
    }
  }
}
