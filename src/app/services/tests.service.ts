import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Guid } from 'guid-typescript';
import { Test } from '../models/test';
import { NewTest } from '../models/newTest';
import { Question } from '../models/question';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient) {}

  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(`${environment.apiUrl}/Test/getAllTests`);
  }

  getTest(id: Guid): Observable<Test> {
    return this.http.get<Test>(`${environment.apiUrl}/Test/getTest/${id}`);
  }

  createTest(data: any) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<NewTest>(
      `${environment.apiUrl}/Test/createTest`,
      data,
      {
        headers: headers,
      }
    );
  }

  getEditTest(id: Guid): Observable<Test> {
    return this.http.get<Test>(`${environment.apiUrl}/Test/editTest/${id}`);
  }

  editTest(id: Guid, data: any): Observable<NewTest> {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.patch<NewTest>(
      `${environment.apiUrl}/Test/editTest/${id}`,
      data,
      {
        headers: headers,
      }
    );
  }

  deleteTest(id: Guid) {
    return this.http.delete(`${environment.apiUrl}/Test/deleteTest/${id}`);
  }
}
