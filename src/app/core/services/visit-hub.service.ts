import { Injectable } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HttpTransportType,
} from '@microsoft/signalr';
import { Subject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { VisitNotification } from 'src/app/shared/models/VisitNotification.model';

@Injectable({
  providedIn: 'root',
})
export class VisitHubService {
  private hubConnection: HubConnection | null = null;
  visitAdded = new Subject<VisitNotification>();

  constructor(private _authService: AuthService) {}

  startConnection = () => {
    const token = this._authService.getToken();

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.visithub, {
        accessTokenFactory: () => token!,
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected.'))
      .catch((err) => console.error('SignalR Connection Error: ', err));

    this.hubConnection.on('ReceiveVisit', (visit: VisitNotification) => {
      this.visitAdded.next(visit);
    });
  };
}
