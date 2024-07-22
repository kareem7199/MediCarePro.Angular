import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './features/login/login.component';
import { RoleGuard } from './core/guards/role.guard';
import { Role } from './shared/enums/role.enum';
import { HomeComponent } from './features/home/home.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { AppointmentsComponent } from './features/appointments/appointments.component';
import { VisitsComponent } from './features/visits/visits.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { AddUserComponent } from './features/add-user/add-user.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: [Role.Physician, Role.Reception , Role.UserCreator] },
      },
      {
        path: 'appointments',
        component: AppointmentsComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: [Role.Reception] },
      },
      {
        path: 'visits',
        component: VisitsComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: [Role.Physician] },
      },
      {
        path: 'adduser',
        component: AddUserComponent,
        canActivate: [RoleGuard],
        data: { expectedRoles: [Role.UserCreator] },
      },
    ],
  },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
