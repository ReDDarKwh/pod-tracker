import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {
  titleSubject: BehaviorSubject<string>;

  constructor() {
    this.titleSubject = new BehaviorSubject('');
  }
}
