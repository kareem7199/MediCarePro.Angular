import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Item } from 'src/app/shared/models/Item.model';
import { tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class InventoryAccountingScreenService {
  constructor(private _http: HttpClient, private _authService: AuthService) {}

  getItems() {
    return this._http
      .get<Item[]>(`${environment.apiUrl}/InventoryAccountingScreen/Item`, {
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

  processTransactions(itemId: number, inventoryStrategy: string) {
    return this._http
      .get<any>(`${environment.apiUrl}/InventoryAccountingScreen?`, {
        headers: {
          Authorization: `Bearer ${this._authService.getToken()}`,
        },
        params: {
          itemId,
          inventoryStrategy,
        },
      })
      .pipe(
        tap((response) => {
          return response;
        })
      );
  }
}
