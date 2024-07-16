import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ReceptionScreenService } from 'src/app/core/services/reception-screen.service';
import { Patient } from '../../models/Patient.model';
import { PhysicianSchedule } from '../../models/PhysicianSchedule.model';
import { VisitNotificationService } from 'src/app/core/services/visit-notification.service';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: './schedule-dialog.component.html',
  styleUrls: ['./schedule-dialog.component.css'],
})
export class ScheduleDialogComponent {
  searchTerm: string = '';
  searchResults: Patient[] = [];
  selectedPatient!: Patient;
  physicianFees: number | null = null;
  noResultsFound: boolean = false; // Add property for no results
  date!: Date;
  physicianSchedule!: PhysicianSchedule;
  physicianId!: string;
  time: string;

  constructor(
    public dialogRef: MatDialogRef<ScheduleDialogComponent>,
    private _receptionScreenService: ReceptionScreenService,
    private _toastr: ToastrService,
    private visitNotificationService: VisitNotificationService ,
    @Inject(MAT_DIALOG_DATA) public data: any // Inject data here
    
  ) {
    this.time = data.time;
    this.physicianSchedule = data.physicianSchedule;
    this.date = data.date;
    this.physicianId = data.physicianId
  }

  onSearch(): void {
    this._receptionScreenService.getPatients(this.searchTerm).subscribe({
      next: (response) => {
        this.searchResults = response;
        this.noResultsFound = this.searchResults.length === 0;
      },
      error: (error) => {
        this._toastr.error(error, 'Error');
      },
    });
  }

  selectPatient(patient: any): void {
    this.selectedPatient = patient;
    this.searchResults = [];
  }

  save(): void {
    // Handle save logic here
    this._receptionScreenService
      .createVisit(
        this.physicianFees ?? 0,
        '35ac1906-2a1e-4be7-9dd6-db30fb7b71f6',
        this.selectedPatient.id,
        this.physicianSchedule.id,
        this.setTimeToDate(this.date , this.time)
      )
      .subscribe({
        next: (response) => {
          this._toastr.success('Visit created successfully', 'Success');
          this.visitNotificationService.notifyVisitAdded();
        },
        error: (error) => {
          this._toastr.error(error, 'Error');
        },
      });
    this.dialogRef.close();
  }

  setTimeToDate(date : Date, timeString : string) {
    // Split the timeString into hours, minutes, and seconds
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
  
    // Set hours, minutes, and seconds to the date object
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(seconds);
  
    return date;
  }
   formatDateWithOffset(date : Date) {
    // Get local time zone offset in minutes
    const offsetMinutes = date.getTimezoneOffset();
  
    // Calculate offset in milliseconds
    const offsetMilliseconds = offsetMinutes * 60 * 1000;
  
    // Adjust date to account for local time zone offset
    const adjustedDate = new Date(date.getTime() + offsetMilliseconds);
  
    // Format adjusted date to ISO 8601 format with offset
    const isoStringWithOffset = adjustedDate.toISOString();
  
    return isoStringWithOffset;
  }
}
