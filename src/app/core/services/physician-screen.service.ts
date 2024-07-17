import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { DetailedVisit } from 'src/app/shared/models/DetailedVisit.model';
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

  updateVisitDiagnosis(id : number , diagnosis : string){
    return this._http
      .patch<any>(
        `${environment.apiUrl}/PhysicianScreen/Visit`,
        {
          id ,
          diagnosis
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
