import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Guid } from 'guid-typescript';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiUrl}/Admin/getAllUsers`);
  }

  createAdmin(params: any) {
    return this.http.post(`${environment.apiUrl}/Admin/createAdmin`, params);
  }

  editAdmin(id: Guid): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/Admin/editUser/${id}`);
  }

  editAdminPatch(id: Guid, params: any) {
    return this.http.patch(
      `${environment.apiUrl}/Admin/editUser/${id}`,
      params
    );
  }

  deleteAdmin(id: Guid) {
    return this.http
      .delete(`${environment.apiUrl}/Admin/deleteUser/${id}`)
      .pipe(
        finalize(() => {
          // auto logout if the logged in account was deleted
          const currentUser = this.authenticationService.currentUserValue;
          if (id === currentUser.id) {
            this.authenticationService.logout();
          }
        })
      );
  }
}
