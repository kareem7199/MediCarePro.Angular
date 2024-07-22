import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { JwtModule } from '@auth0/angular-jwt';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

import { AppComponent } from './app.component';
import { LoginComponent } from './features/login/login.component';
import { HomeComponent } from './features/home/home.component';
import { MainLayoutComponent } from './shared/layouts/main-layout/main-layout.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AppointmentsComponent } from './features/appointments/appointments.component';
import { ScheduleComponent } from './shared/components/schedule/schedule.component';
import { ScheduleDialogComponent } from './shared/components/schedule-dialog/schedule-dialog.component';
import { VisitsComponent } from './features/visits/visits.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { AddUserComponent } from './features/add-user/add-user.component';

export function tokenGetter() {
  return localStorage.getItem('authToken');
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MainLayoutComponent,
    NavbarComponent,
    AppointmentsComponent,
    ScheduleComponent,
    ScheduleDialogComponent,
    VisitsComponent,
    NotFoundComponent,
    AddUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter
      },
    }),
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
