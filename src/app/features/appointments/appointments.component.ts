import { Component, OnInit } from '@angular/core';

interface SelectedTime {
  index: number;
  day: Date;
  patient: string;
}

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
})
export class AppointmentsComponent {
}
