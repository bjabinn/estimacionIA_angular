import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangeService {
  constructor() { }

  private componentSubject = new BehaviorSubject<string>('FixedHeaderComponent');

  setCurrentComponent(component: string) {
    this.componentSubject.next(component);
  }

  getCurrentComponent() {
    return this.componentSubject.asObservable();
  }

}
