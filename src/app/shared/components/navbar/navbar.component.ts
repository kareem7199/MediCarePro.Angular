import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { Role } from '../../enums/role.enum';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html'
})
export class NavbarComponent {
  constructor(public _authService: AuthService){}
}
