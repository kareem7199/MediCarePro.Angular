import { Component, OnInit } from '@angular/core';
import { ReceptionScreenService } from 'src/app/core/services/reception-screen.service';
import { Physician } from 'src/app/shared/models/Physician.model';
import { Specialty } from 'src/app/shared/models/Specialty.model';

@Component({
  selector: 'app-appointments',
  templateUrl: './appointments.component.html',
})

export class AppointmentsComponent implements OnInit {
  specialties : Specialty[] = [];
  physicians : Physician[] = [];
  selectedSpecialtyId : number = 0;
  selectedphysicianId : string = "";
  constructor(private _receptionScreenService: ReceptionScreenService) {}

  ngOnInit(): void {
    this.fetchSpecialties();
  }

  fetchSpecialties(){
    this._receptionScreenService
    .getSpecialties()
    .subscribe((response) => {
      this.specialties = response;
    });
  }
  fetchPhysicians(){
    this._receptionScreenService
    .getPhysicians(this.selectedSpecialtyId)
    .subscribe((response) => {
      this.physicians = response;
    });
  }

  onSubmitSpecialty() {
    if(this.selectedSpecialtyId > 0) {
      this.selectedphysicianId = "";
      this.fetchPhysicians();
    }
  }

  isPhysicianFound() {
    const physician = this.physicians.find(P => P.id === this.selectedphysicianId);
    return physician ? true : false;
  } 
    
}
