import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/Login`;
  private tokenKey = 'authToken';
  
  constructor(private http: HttpClient , private toastr: ToastrService , public jwtHelper: JwtHelperService) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(this.apiUrl, { email, password })
      .pipe(
        tap((response) => {
          localStorage.setItem(this.tokenKey, response.token);
        }),
        catchError((error) => {
          this.toastr.error("Invalid email or password");
          return [];
        })
      );
  }

  public getUserRole(): string {
    const token = this.getToken();
    if (!token) return '';
    
    const decodedToken = this.jwtHelper.decodeToken(token);
    console.log(decodedToken);
    console.log(decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] )
    return decodedToken ? decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] : [];
  }

  logout(): void {
    // Remove the token from local storage
    localStorage.removeItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

}
