import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {} from 'src/app/models/question';
import { QuestionResultInfo } from 'src/app/models/QuestionResultInfo';
import { DownloadService } from 'src/app/services/download.service';

@Component({
  selector: 'app-result-info-dialog',
  templateUrl: './result-info-dialog.component.html',
  styleUrls: ['./result-info-dialog.component.css'],
})
export class ResultInfoDialogComponent implements OnInit {
  loading = false;
  dialogTitle: string;
  fullName: string;
  email: string;
  testTotalPoints: number;
  minutesOvertime: number;
  startedAt: Date;
  resultQuestions: QuestionResultInfo[];

  constructor(
    public dialogRef: MatDialogRef<ResultInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private downloads: DownloadService
  ) {}

  ngOnInit() {
    this.dialogTitle = this.data.dialogTitle;
    this.fullName = this.data.fullName;
    this.email = this.data.email;
    this.testTotalPoints = this.data.testTotalPoints;
    this.minutesOvertime = this.data.minutesOvertime;
    this.startedAt = this.data.startedAt;
    this.resultQuestions = this.data.resultQuestions;
  }

  getPath(num: number) {
    return this.resultQuestions[num].solutionFilePath;
  }

  getSubmitionFilePath(num: number) {
    return this.resultQuestions[num].submitedFilePath;
  }

  download(path: string): void {
    this.downloads.download(path).subscribe((blob) => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = 'Solution';
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }
}
