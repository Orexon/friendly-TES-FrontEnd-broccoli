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
import { ActiveTest } from '../models/activeTest';
import { Solution } from '../models/submitSolution';
import { FinishTest } from '../models/finishTest';

@Injectable({ providedIn: 'root' })
export class ActiveTestService {
  constructor(private http: HttpClient) {}

  activeTest(id: Guid): Observable<ActiveTest> {
    return this.http.get<ActiveTest>(`${environment.apiUrl}/ActiveTest/${id}`);
  }

  activeTestStart(params: any, id: Guid) {
    return this.http.post(
      `${environment.apiUrl}/ActiveTest/startTest/${id}`,
      params
    );
  }

  activeTestQuestion(id: Guid): Observable<ActiveTest> {
    return this.http.get<ActiveTest>(
      `${environment.apiUrl}/ActiveTest/getTestQuestion/${id}`
    );
  }

  submitUserSolution(id: Guid, params: Solution) {
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');

    return this.http.post<any>(
      `${environment.apiUrl}/ActiveTest/submitSolution/${id}`,
      params,
      {
        headers: headers,
      }
    );
  }

  finishTest(data: any, id: Guid) {
    return this.http.post<any>(
      `${environment.apiUrl}/ActiveTest/finishTest/${id}`,
      data
    );
  }
}
