import { Component } from '@angular/core';
import { FixedHeaderComponent } from './fixed-header/fixed-header.component';
@Component({
  selector: 'app-root',
  imports: [FixedHeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'estimacionIA_angular19';
}