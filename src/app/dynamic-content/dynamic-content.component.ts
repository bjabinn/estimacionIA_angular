import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.css'],
  imports:[ReactiveFormsModule]
})
export class DynamicContentComponent {
  @Input() dynamicForm: FormGroup = new FormGroup({}); // Asignar un valor inicial
  @Output() remove = new EventEmitter<void>(); // Emite un evento para eliminar el componente

  // Método para emitir el evento de eliminación
  removeComponent() {
    this.remove.emit();
  }
}