import { Component } from '@angular/core';
import { PhysicianScreenService } from 'src/app/core/services/physician-screen.service';
import { DetailedVisit } from 'src/app/shared/models/DetailedVisit.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css'],
})
export class VisitsComponent {
  date!: Date;
  selectedVisit: DetailedVisit | null = null;
  visits: DetailedVisit[] = [];
  loading = false;

  constructor(
    private _physicianScreenService: PhysicianScreenService,
    private _toastr: ToastrService
  ) {}

  onSelectDate(event: any) {
    this.date = event.target.value;
    this.fetchVisits();
  }

  fetchVisits() {
    this.loading = true;
    this._physicianScreenService.getDailyVisits(this.date).subscribe({
      next: (response) => {
        this.loading = false;
        this.visits = response;
      },
    });
  }

  selectVisit(visit: DetailedVisit) {
    this.selectedVisit = visit;
  }

  formatDate(date: Date) {
    return moment(date).format('HH:mm:ss');
  }

  save() {
    this._physicianScreenService
      .updateVisitDiagnosis(
        this.selectedVisit!.id,
        this.selectedVisit!.diagnosis
      )
      .subscribe({
        next: (response) => {
          this._toastr.success('Diagnosis updated successfully', 'Success');
        },
        error: (error) => {
          this._toastr.error(error, 'Error');
        },
      });
  }
}
