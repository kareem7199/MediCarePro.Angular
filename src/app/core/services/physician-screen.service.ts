import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { DetailedVisit } from 'src/app/shared/models/DetailedVisit.model';
import { Diagnosis } from 'src/app/shared/models/Diagnosis.model';
@Injectable({
  providedIn: 'root',
})
export class PhysicianScreenService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getDailyVisits(date: Date) {
    return this._http
      .get<DetailedVisit[]>(
        `${environment.apiUrl}/PhysicianScreen/Visit?date=${date}`,
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

  updateVisitDiagnosis(diagnosisId:number , boneName : string , visitId : number , fees : number , procedure : string , diagnosisDetails : string){
    return this._http
      .put<Diagnosis>(
        `${environment.apiUrl}/PhysicianScreen/Visit/${diagnosisId}`,
        {
          boneName,
          visitId,
          fees,
          procedure,
          diagnosisDetails
        },
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

  AddVisitDiagnosis(boneName : string , visitId : number , fees : number , procedure : string , diagnosisDetails : string){
    return this._http
      .post<Diagnosis>(
        `${environment.apiUrl}/PhysicianScreen/Visit`,
        {
          boneName,
          visitId,
          fees,
          procedure,
          diagnosisDetails
        },
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
}
