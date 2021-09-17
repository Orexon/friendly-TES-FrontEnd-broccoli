import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class DownloadService {
  constructor(private http: HttpClient) {}

  // Download/{filePath}
  //return this.http.get<Test>(`${environment.apiUrl}/Test/getTest/${id}`);

  // getTest(id: Guid): Observable<Test> {
  //   return this.http.get<Test>(`${environment.apiUrl}/Test/getTest/${id}`);
  // }

  download(filePath: string): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/File/Download/${filePath}`, {
      responseType: 'blob',
    });
  }
}
