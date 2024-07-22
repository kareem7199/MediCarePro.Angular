import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { tap } from 'rxjs';
import { Role } from 'src/app/shared/models/Role.model';
import { Specialty } from 'src/app/shared/models/Specialty.model';

@Injectable({
  providedIn: 'root',
})
export class UserCreationScreenService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getRoles() {
    return this._http
      .get<Role[]>(`${environment.apiUrl}/UserCreationScreen/Role`, {
        headers: {
          Authorization: `Bearer ${this._authService.getToken()}`,
        },
      })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  getSpecialties() {
    return this._http
      .get<Specialty[]>(`${environment.apiUrl}/UserCreationScreen/Specialty`, {
        headers: {
          Authorization: `Bearer ${this._authService.getToken()}`,
        },
      })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }

  createUser(
    firstName: string,
    secondName: string,
    phoneNumber: string,
    email: string,
    selectedRoles: string[],
    selectedSpecialty: Specialty | null
  ) {
    return this._http.post<any>(
      `${environment.apiUrl}/UserCreationScreen/CreateUser`,
      {
        firstName,
        secondName,
        phoneNumber,
        email,
        roles : selectedRoles,
        specialtyId : selectedSpecialty,
      },
      {
        headers: {
          Authorization: `Bearer ${this._authService.getToken()}`,
        },
      },
    );
  }
}
