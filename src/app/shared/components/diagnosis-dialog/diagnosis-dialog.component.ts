import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DiagnosisNotificationService } from 'src/app/core/services/diagnosis-notification.service';
import { PhysicianScreenService } from 'src/app/core/services/physician-screen.service';
import { VisitNotificationService } from 'src/app/core/services/visit-notification.service';

@Component({
  selector: 'app-diagnosis-dialog',
  templateUrl: './diagnosis-dialog.component.html',
  styleUrls: ['./diagnosis-dialog.component.css'],
})
export class DiagnosisDialogComponent {
  diagnosis = {
    boneName: '',
    fees: 0,
    visitId: 0,
    procedure: '',
    diagnosisDetails: '',
  };
  diagnosisId: number | null = null;
  constructor(
    public dialogRef: MatDialogRef<DiagnosisDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _physicianScreenService: PhysicianScreenService,
    private _dignosisNotificationService: DiagnosisNotificationService
  ) {
    this.diagnosis.boneName = data.boneName;
    this.diagnosis.visitId = data.visitId;
    this.diagnosis.procedure = data.procedure;
    this.diagnosis.diagnosisDetails = data.diagnosisDetails;
    this.diagnosis.fees = data.fees;
    if (data.diagnosisId) this.diagnosisId = data.diagnosisId;
  }

  save() {
    if (!this.diagnosisId) {
      this._physicianScreenService
        .AddVisitDiagnosis(
          this.diagnosis.boneName,
          this.diagnosis.visitId,
          this.diagnosis.fees,
          this.diagnosis.procedure,
          this.diagnosis.diagnosisDetails
        )
        .subscribe({
          next: (data) => {
            this._dignosisNotificationService.sendDiagnosis({...data , visitId : this.diagnosis.visitId});
            this.dialogRef.close();
          },
        });
    }
  }
}
