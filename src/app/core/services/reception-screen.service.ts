import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { PhysicianSchedule } from 'src/app/shared/models/PhysicianSchedule.model';
import { Visit } from 'src/app/shared/models/Visit.model';

@Injectable({
  providedIn: 'root',
})
export class ReceptionScreenService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getPhysicianSchedule(physicianId: string) {
    return this._http
      .get<PhysicianSchedule[]>(
        `${environment.apiUrl}/ReceptionScreen/Schedule/${physicianId}`,
        {
          headers: {
            Authorization: `Bearer ${this._authService.getToken()}`,
          },
        }
      )
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getPhysicianVisits(physicianId: string, from: Date, to: Date) {
    return this._http
      .get<Visit[]>(
        `${
          environment.apiUrl
        }/ReceptionScreen/Visit/${physicianId}?from=${from.toISOString()}&to=${to.toISOString()}`,
        {
          headers: {
            Authorization: `Bearer ${this._authService.getToken()}`,
          },
        }
      )
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getPatients(searchTerm: string | undefined) {
    if (searchTerm) searchTerm = searchTerm.trim();
    return this._http
      .get<any[]>(
        `${environment.apiUrl}/ReceptionScreen/Patient?searchTerm=${searchTerm}`,
        {
          headers: {
            Authorization: `Bearer ${this._authService.getToken()}`,
          },
        }
      )
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  createVisit(
    physicanFees: number,
    physicanId: string,
    patientId: string,
    physicianScheduleId: number,
    date: Date
  ) {
    return this._http.post<Visit>(
      `${environment.apiUrl}/ReceptionScreen/Visit`,
      {
        physicanFees,
        accountId: physicanId,
        patientId,
        physicianScheduleId,
        date : date.toString().slice(0 , 24),
      },
      {
        headers: {
          Authorization: `Bearer ${this._authService.getToken()}`,
        },
      }
    ).pipe(
      tap((response) => {
        return response;
      })
    );
  }
}
