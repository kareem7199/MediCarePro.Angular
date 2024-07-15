import { Component } from '@angular/core';
import { PhysicianSchedule } from '../../models/PhysicianSchedule.model';

interface SelectedTime {
  index: number;
  patient: string;
  day: Date;
}

interface Visit {
  patientName: string;
  date: Date;
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],
})
export class ScheduleComponent {
  timeSelected: SelectedTime = {
    index: -5,
    patient: 'Kareem Tamer',
    day: new Date(),
  };

  visits: Visit[] = [
    {
      patientName: "Ahmed",
      date: new Date('2024-07-13T14:30:00'),
    },
    {
      patientName: "Mahmoud",
      date: new Date('2024-07-13T16:30:00'),
    },
  ];

  days: Date[] = [];
  skipDays = 0;
  physicianSchedule: PhysicianSchedule[] = [
    {
      id: 1,
      day: 'Saturday',
      startTime: '14:30:00',
      endTime: '20:00:00',
    },
    {
      id: 3,
      day: 'Sunday',
      startTime: '14:30:00',
      endTime: '20:00:00',
    },
    {
      id: 4,
      day: 'Monday',
      startTime: '15:30:00',
      endTime: '20:00:00',
    },
  ];

  startTime!: string;
  endTime!: string;
  slots: string[] = [];

  ngOnInit(): void {
    this.generateDays();
    this.timeSelected.day = this.days[0];
    this.generateTimeSlots();
  }
  generateDays() {
    this.days = [];
    for (let i = 0; i < 3; i++) {
      const result = new Date();
      result.setHours(0, 0, 0, 0);
      result.setDate(result.getDate() + (i + this.skipDays * 3));
      this.days.push(result);
    }
  }

  getEarliestAndLatestTimes() {
    let earliestStartTime = this.physicianSchedule[0].startTime;
    let latestEndTime = this.physicianSchedule[0].endTime;

    this.physicianSchedule.forEach((entry) => {
      if (entry.startTime < earliestStartTime) {
        earliestStartTime = entry.startTime;
      }
      if (entry.endTime > latestEndTime) {
        latestEndTime = entry.endTime;
      }
    });

    this.startTime = earliestStartTime;
    this.endTime = latestEndTime;
  }

  generateTimeSlots() {
    this.getEarliestAndLatestTimes();

    const start = new Date(`1970-01-01T${this.startTime}Z`);
    const end = new Date(`1970-01-01T${this.endTime}Z`);
    const slots = [];
    const slotInterval = 15; // 15 minutes interval

    end.setMinutes(end.getMinutes() + 2 * slotInterval);

    while (start <= end) {
      slots.push(start.toISOString().slice(11, 19));
      start.setMinutes(start.getMinutes() + slotInterval);
    }

    this.slots = slots;
  }

  selectTime(index: number, day: Date) {
    if (!this.isSlotDisabled(day, index) && !this.isVisit(day , index) && !this.isVisit(day , index + 1) && !this.isVisit(day , index + 2)) {
      this.timeSelected.day = day;
      this.timeSelected.index = index;
    }
  }

  isDisplayed(index: number, day: Date) {
    if(this.isVisit(day, index - 1) || this.isVisit(day, index - 2)) return false;
    return (
      !this.compareDates(this.timeSelected.day, day) ||
      this.isSelected(index, day) ||
      (index - this.timeSelected.index !== 2 &&
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
  }

  previous() {
    this.skipDays--;
    this.generateDays();
  }

  compareDates(d1: Date, d2: Date): boolean {
    const time1 = d1.getTime();
    const time2 = d2.getTime();
    return time1 === time2;
  }

  isSlotDisabled(day: Date, index: number) {
    const dayString = this.getDayFromDate(day);
    const isFound = this.physicianSchedule.find((PS) => PS.day === dayString)
      ? false
      : true;
    return isFound || index >= this.slots.length - 2;
  }

  getDayFromDate(date: Date): string {
    const options = { weekday: 'long' } as const; // Use 'short' for abbreviated day names if preferred
    return date.toLocaleDateString('en-US', options);
  }

  getTimeFromDate(date: Date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  removeTimeFromDate(date: Date) {
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);
    return date;
  }

  areDatesEqualWithoutTime(date1: Date, date2: Date) {
    // Set hours, minutes, seconds, and milliseconds to zero
    const d1 = new Date(date1);
    d1.setHours(0, 0, 0, 0);

    const d2 = new Date(date2);
    d2.setHours(0, 0, 0, 0);

    // Compare dates without time
    return d1.getTime() === d2.getTime();
  }

  isVisit(date: Date, index: number) {
    let visit = this.getVisit(index , date);
    if(visit) return true;
    return false;
  }

  getVisit(index : number , date : Date){
    return this.visits.find(V => this.areDatesEqualWithoutTime(V.date, date) && index === this.slots.indexOf(this.getTimeFromDate(V.date)));
  }
}
