import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from './shared/enums/role.enum';
import { HomeComponent } from './features/home/home.component';

const routes: Routes = [
  {path : 'login' , component : LoginComponent},
  {path : '' , canActivate : [RoleGuard] , data : {expectedRoles : [Role.Physician , Role.Reception]} , component : HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
