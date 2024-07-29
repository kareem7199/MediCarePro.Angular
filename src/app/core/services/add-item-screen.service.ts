import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class AddItemScreenService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  addItem(itemName: string) {
    return this._http
      .post(
        `${environment.apiUrl}/ItemCreationScreen`,
        {
          name: itemName,
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
