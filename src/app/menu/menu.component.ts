import { Component } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChangeService } from "src/app/change.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
  imports: [
    
  ],
})

export class MenuComponent {
  constructor(private ChangeService: ChangeService){

  }

  changeComponent(component: string){
    this.ChangeService.setCurrentComponent(component)
  }
}