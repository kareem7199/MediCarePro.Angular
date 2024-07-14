import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import { HttpClient } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { User } from '../../shared/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Claims } from 'src/app/shared/enums/claims.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/Login`;
  private tokenKey = 'authToken';

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    public jwtHelper: JwtHelperService
  ) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<any>(this.apiUrl, { email, password }).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.token);
      }),
      catchError((error) => {
        this.toastr.error('Invalid email or password');
        return [];
      })
    );
  }

  public getUserData(): User | null {
    const token = this.getToken();
    if (!token) return null;

    const decodedToken = this.jwtHelper.decodeToken(token);

    if (decodedToken) {
      let user: User = {
        email: decodedToken[Claims.Email],
        role: decodedToken[Claims.Role],
        username: decodedToken[Claims.Username],
      };
      return user;
    }

    return null;
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
