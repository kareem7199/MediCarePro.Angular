import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs';
import { Item } from 'src/app/shared/models/Item.model';
@Injectable({
  providedIn: 'root',
})
export class AddTransactionScreenService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getItems() {
    return this._http
      .get<Item[]>(`${environment.apiUrl}/TransactionCreationScreen/Item`, {
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

  addTransaction(amount : number , quantity : number , itemId : number , action : string) {
    return this._http
      .post(
        `${environment.apiUrl}/TransactionCreationScreen/Transaction`,
        {
          amount,
          quantity,
          itemId,
          action
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
