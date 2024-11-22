import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.css']
})
export class DynamicContentComponent {
  @Output() remove = new EventEmitter<void>();

  removeComponent() {
    this.remove.emit();
  }
}