import { Component, OnInit } from '@angular/core';
import { PhysicianSchedule } from '../../models/PhysicianSchedule.model';
import { ToastrService } from 'ngx-toastr';
import { ReceptionScreenService } from 'src/app/core/services/reception-screen.service';
import { Visit } from '../../models/Visit.model';

interface SelectedTime {
  index: number;
  patient: string;
  day: Date;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent implements OnInit {
  timeSelected: SelectedTime = {
    index: -5,
    patient: 'Kareem Tamer',
    day: new Date(),
  };

  visits: Visit[] = [
    // { patientName: 'Ahmed', date: new Date('2024-07-13T14:30:00') },
    // { patientName: 'Mahmoud Alaa', date: new Date('2024-07-16T17:30:00') },
    // { patientName: 'Hesham Mohammed', date: new Date('2024-07-16T16:30:00') },
    // { patientName: 'Mahmoud Samir', date: new Date('2024-07-16T13:30:00') },
  ];

  days: Date[] = [];
  skipDays = 0;
  physicianSchedule: PhysicianSchedule[] = [];

  startTime!: string;
  endTime!: string;
  slots: string[] = [];

  constructor(
    private _toastr: ToastrService,
    private _receptionScreenService: ReceptionScreenService
  ) {}
  ngOnInit(): void {
    this._receptionScreenService
      .getPhysicianSchedule('22a17dc1-0cda-4a9b-b8dc-1feb6490cd57')
      .subscribe({
        next: (response) => {
          this.physicianSchedule = response;
          this.initializeSchedule();
        },
      });
  }

  private initializeSchedule() {
    this.generateDays();
    this.timeSelected.day = this.days[0];
    this.generateTimeSlots();
    this.fetchVisits();
  }

  fetchVisits() {
   const to = new Date(this.days[2]);
   to.setDate(to.getDate() + 1);
    this._receptionScreenService
      .getPhysicianVisits(
        '22a17dc1-0cda-4a9b-b8dc-1feb6490cd57',
        this.days[0],
        to
      )
      .subscribe({
        next: (response) => {
          response = response.map((visit) => {
            visit.date = new Date(visit.date);
            return visit;
          });
          this.visits = response;
        },
      });
  }

  private generateDays() {
    this.days = [];
    for (let i = 0; i < 3; i++) {
      const result = new Date();
      result.setHours(0, 0, 0, 0);
      result.setDate(result.getDate() + i + this.skipDays * 3);
      this.days.push(result);
    }
  }

  private getEarliestAndLatestTimes() {
    this.startTime = this.physicianSchedule.reduce(
      (earliest, current) =>
        current.startTime < earliest ? current.startTime : earliest,
      this.physicianSchedule[0].startTime
    );

    this.endTime = this.physicianSchedule.reduce(
      (latest, current) =>
        current.endTime > latest ? current.endTime : latest,
      this.physicianSchedule[0].endTime
    );
  }

  private generateTimeSlots() {
    this.getEarliestAndLatestTimes();
    const slots = [];
    const start = new Date(`1970-01-01T${this.startTime}Z`);
    const end = new Date(`1970-01-01T${this.endTime}Z`);
    const slotInterval = 15; // 15 minutes interval

    start.setMinutes(end.getMinutes());
    end.setMinutes(end.getMinutes() + 2 * slotInterval);

    while (start <= end) {
      slots.push(start.toISOString().slice(11, 19));
      start.setMinutes(start.getMinutes() + slotInterval);
    }

    this.slots = slots;
  }

  selectTime(index: number, day: Date) {
    if (this.isSlotDisabled(day, index)) {
      this._toastr.error(
        "This slot is outside the physician's available hours",
        'Unavailable Slot'
      );
      return;
    }

    if (this.isVisit(day, index)) {
      this._toastr.error(
        'This slot is already booked by another patient',
        'Unavailable Slot'
      );
      return;
    }

    if (this.isVisit(day, index + 1)) {
      this._toastr.error(
        'The subsequent slot is already booked by another patient',
        'Unavailable Slot'
      );
      return;
    }

    this.timeSelected.day = day;
    this.timeSelected.index = index;
  }

  isDisplayed(index: number, day: Date) {
    return (
      !this.isVisit(day, index - 1) &&
      (!this.compareDates(this.timeSelected.day, day) ||
        this.isSelected(index, day) ||
        index - this.timeSelected.index !== 1)
    );
  }

  isSelected(index: number, day: Date) {
    return (
      this.timeSelected.index === index &&
      this.compareDates(this.timeSelected.day, day)
    );
  }

  next() {
    this.skipDays++;
    this.generateDays();
    this.fetchVisits();
  }

  previous() {
    this.skipDays--;
    this.generateDays();
    this.fetchVisits();
  }

  private compareDates(d1: Date, d2: Date): boolean {
    const time1 = d1.getTime();
    const time2 = d2.getTime();
    return time1 === time2;
  }

  isSlotDisabled(day: Date, index: number): boolean {
    const dayString = this.getDayFromDate(day);
    const physicianScheduleDay = this.physicianSchedule.find(
      (PS) => PS.day === dayString
    );

    if (!physicianScheduleDay) return true;

    const startTime = new Date(`1970-01-01T${physicianScheduleDay.startTime}Z`);
    const endTime = new Date(`1970-01-01T${physicianScheduleDay.endTime}Z`);
    const slotTime = new Date(`1970-01-01T${this.slots[index]}Z`);

    return (
      slotTime < startTime ||
      slotTime > endTime ||
      index >= this.slots.length - 2
    );
  }

  private getDayFromDate(date: Date): string {
    const options = { weekday: 'long' } as const;
    return date.toLocaleDateString('en-US', options);
  }

  private getTimeFromDate(date: Date): string {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private removeTimeFromDate(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private areDatesEqualWithoutTime(date1: Date, date2: Date): boolean {
    const d1 = this.removeTimeFromDate(new Date(date1));
    const d2 = this.removeTimeFromDate(new Date(date2));
    return d1.getTime() === d2.getTime();
  }

  isVisit(date: Date, index: number): boolean {
    return !!this.getVisit(index, date);
  }

  getVisit(index: number, date: Date): Visit | undefined {
    return this.visits.find(
      (visit) =>
        this.areDatesEqualWithoutTime(visit.date, date) &&
        index === this.slots.indexOf(this.getTimeFromDate(visit.date))
    );
  }
}
