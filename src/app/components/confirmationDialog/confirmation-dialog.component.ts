import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.css'],
})
export class ConfirmationDialogComponent implements OnInit {
  dialogMessage: string = 'Are you sure?';
  confirmBtnTxt = 'Yes';
  cancelBtnTxt = 'Cancel';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data) {
      this.dialogMessage = data.dialogMessage || this.dialogMessage;
      this.confirmBtnTxt = data.confirmBtnTxt || this.confirmBtnTxt;
      this.cancelBtnTxt = data.cancelBtnTxt || this.cancelBtnTxt;
    }
  }

  ngOnInit(): void {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
