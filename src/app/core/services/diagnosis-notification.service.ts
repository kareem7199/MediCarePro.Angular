import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Diagnosis } from 'src/app/shared/models/Diagnosis.model';
import { DiagnosisNotification } from 'src/app/shared/models/DiagnosisNotification.model';

@Injectable({
  providedIn: 'root'
})
export class DiagnosisNotificationService {

  private newDiagnosis = new BehaviorSubject<DiagnosisNotification | null>(null);
  newDiagnosis$ = this.newDiagnosis.asObservable();
  
  constructor() { }

  sendDiagnosis(data: DiagnosisNotification) {
    this.newDiagnosis.next(data);
  }
}
