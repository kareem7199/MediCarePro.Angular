import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Visit } from 'src/app/shared/models/Visit.model';

@Injectable({
  providedIn: 'root'
})
export class VisitNotificationService {
  private visitAddedSource = new Subject<void>();
  visitAdded$ = this.visitAddedSource.asObservable();

  constructor() {}

  notifyVisitAdded() {
    this.visitAddedSource.next();
  }
}
