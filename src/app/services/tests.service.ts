import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Guid } from 'guid-typescript';
import { Test } from '../models/test';

@Injectable({ providedIn: 'root' })
export class TestService {
  constructor(private http: HttpClient) {}

  getAllTests(): Observable<Test[]> {
    return this.http.get<Test[]>(`${environment.apiUrl}/Test/getAllTests`);
  }
}
