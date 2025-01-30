import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FixedHeaderComponent } from './fixed-header/fixed-header.component';
import { MenuComponent } from "./menu/menu.component";
import { ViewEstimacionComponent } from './view-estimacion/view-estimacion.component';
import { ChangeService } from "./change.service";

@Component({
  selector: 'app-root',
  imports: [
    FixedHeaderComponent,
    MenuComponent, 
    CommonModule,
    ViewEstimacionComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})

export class AppComponent {
  title = 'estimacionIA_angular19';
  currentComponent: string = '';

  constructor(private ChangeService: ChangeService){

  }

  ngOnInit() {
    this.ChangeService.getCurrentComponent().subscribe(component => {
      this.currentComponent = component;
    });
  }
}
