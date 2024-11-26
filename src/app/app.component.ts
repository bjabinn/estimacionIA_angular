import { Component } from '@angular/core';
import { FixedHeaderComponent } from './fixed-header/fixed-header.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  imports: [FixedHeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'estimacionIA_angular19';
}
