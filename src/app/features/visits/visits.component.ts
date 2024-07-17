import { Component, OnDestroy, OnInit } from '@angular/core';
import { PhysicianScreenService } from 'src/app/core/services/physician-screen.service';
import { DetailedVisit } from 'src/app/shared/models/DetailedVisit.model';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { VisitHubService } from 'src/app/core/services/visit-hub.service';
import { Howl } from 'howler';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-visits',
  templateUrl: './visits.component.html',
  styleUrls: ['./visits.component.css'],
})
export class VisitsComponent implements OnInit , OnDestroy {
  date!: Date;
  selectedVisit: DetailedVisit | null = null;
  visits: DetailedVisit[] = [];
  loading = false;
  private subscription!: Subscription;
  sound = new Howl({
    src: ['assets/sounds/notification.mp3'],
    volume: 1.0, // Adjust volume as needed (0.0 to 1.0)
    onloaderror: (error) => {
      console.error('Failed to load sound:', error);
    }
  })
  constructor(
    private _physicianScreenService: PhysicianScreenService,
    private _toastr: ToastrService,
    private _visitHubService: VisitHubService
  ) {}
  ngOnInit(): void {
    this._visitHubService.startConnection();

    this.subscription = this._visitHubService.visitAdded.subscribe({
      next: (response) => {
        const date1 = moment(this.date);
        const date2 = moment(response.date);
        if(date1.isSame(date2)) {
          console.log(this.visits);
          this.visits.push(response.visit);
          console.log(this.visits);
          this.visits.sort(this.sortByDate);
          this._toastr.success('New visit added!', 'Notification');
          this.sound.play();
        }
      }
    })
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

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

  private sortByDate(a: DetailedVisit, b: DetailedVisit) {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  }

}
