import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Question } from 'src/app/models/question';
import { QuestionType } from 'src/app/models/questionType';
import { TestLink } from 'src/app/models/testLink';
import { StateType } from 'src/app/models/testType';
import { DownloadService } from 'src/app/services/download.service';
import { TestService } from 'src/app/services/tests.service';

@Component({
  selector: 'app-test-info-dialog',
  templateUrl: './test-info-dialog.component.html',
  styleUrls: ['./test-info-dialog.component.css'],
})
export class TestInfoDialogComponent implements OnInit {
  loading = false;
  dialogTitle: string;
  description: string;
  questions: Question[];
  testType: string;
  createTime: Date;
  validFrom: Date;
  validTo: Date;
  timeLimit: {
    days: number;
    hours: number;
    mins: number;
  };
  urlLinkId: string;
  constructor(
    public dialogRef: MatDialogRef<TestInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private downloads: DownloadService
  ) {}

  ngOnInit() {
    console.log(this.data);

    this.dialogTitle = this.data.dialogTitle;
    this.description = this.data.description;
    this.questions = this.data.questions;
    this.testType = StateType[this.data.testType];
    this.createTime = this.data.createTime;
    this.validFrom = this.data.validFrom;
    this.validTo = this.data.validTo;
    this.timeLimit = this.data.timeLimit;
    this.urlLinkId = this.data.testLink.urlLink;
  }

  checkType(num: number) {
    if (0) {
      return 'C#';
    } else {
      return 'Mixed';
    }
  }

  getPath(num: number) {
    return this.questions[num].solutionFilePath;
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
