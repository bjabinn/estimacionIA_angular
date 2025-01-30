import { Component } from '@angular/core';
import { ChangeService } from "src/app/change.service";

@Component({
  selector: 'app-view-estimacion',
  imports: [],
  templateUrl: './view-estimacion.component.html',
  styleUrl: './view-estimacion.component.css'
})
export class ViewEstimacionComponent {
  constructor(ChangeService: ChangeService){

  }
}
