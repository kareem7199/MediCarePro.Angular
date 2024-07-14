import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{

  constructor(private _authService: AuthService , private _router: Router) {}
  
  onSubmit(loginForm: NgForm) {
    this._authService.login(loginForm.value.email, loginForm.value.password).subscribe({
      next: () => {
        this._router.navigate(['/']);
      }
    });
  }
}
