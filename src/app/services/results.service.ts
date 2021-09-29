import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Guid } from 'guid-typescript';
import { Result, ResultSimplyfied } from '../models/result';
import { ResultInfo } from '../models/resultsInfo';
import { TestResultDto } from '../models/testResultDto';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  constructor(private http: HttpClient) {}

  getAllResults(): Observable<ResultSimplyfied[]> {
    return this.http.get<ResultSimplyfied[]>(
      `${environment.apiUrl}/Result/getAllResults`
    );
  }

  getResultDetails(testId: Guid, applicantId: Guid): Observable<ResultInfo> {
    return this.http.get<ResultInfo>(
      `${environment.apiUrl}/Result/getResultDetails/${testId}/${applicantId}`
    );
  }

  getTestResults(id: Guid): Observable<TestResultDto[]> {
    return this.http.get<TestResultDto[]>(
      `${environment.apiUrl}/Result/getTest/${id}`
    );
  }
}
