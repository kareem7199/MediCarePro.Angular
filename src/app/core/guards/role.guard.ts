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
    const expectedRole = route.data['expectedRoles']; // Access expectedRoles using bracket notation

    const userRole = this.authService.getUserData()?.role;

    if(!userRole) this.router.navigate(['/login']);

    for(let i = 0 ; i < expectedRole.length ; i++){
      if(this.authService.hasRole(expectedRole[i])) return true;
    }

    return this.router.navigate(['/notfound']); // Navigate to 'not-authorized' route
  }
}
