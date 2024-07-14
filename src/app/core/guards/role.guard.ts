import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service'; // Update path as necessary
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const expectedRole = route.data['expectedRole']; // Access expectedRoles using bracket notation

    const userRole = this.authService.getUserRole();

    if (!userRole || !(expectedRole == userRole)) {
      // return this.router.navigate(['/notfound']); // Navigate to 'not-authorized' route
    }
    return true;
  }
}
