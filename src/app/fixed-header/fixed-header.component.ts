import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule  } from '@angular/forms';
import { DynamicContentComponent } from '../dynamic-content/dynamic-content.component';

@Component({
  selector: 'app-fixed-header',
  templateUrl: './fixed-header.component.html',
  styleUrls: ['./fixed-header.component.css'],
  imports:[ReactiveFormsModule, CommonModule, DynamicContentComponent]
})
export class FixedHeaderComponent {
  projectForm: FormGroup;

  constructor(private fb: FormBuilder) {
    // Crear el formulario reactivo con validadores básicos
    this.projectForm = this.fb.group({
      proyecto: ['', Validators.required],
      sprint: ['', Validators.required],
      historiaJira: ['', Validators.required],
      historia: ['', Validators.required],
      componentes: this.fb.array([]) // FormArray para manejar componentes dinámicos
    });
  }

  // Obtener el FormArray de componentes y asegurar que los controles son de tipo FormGroup
  get componentes(): FormArray {
    return this.projectForm.get('componentes') as FormArray;
  }

  // Método para obtener un FormGroup específico del FormArray
  getComponenteFormGroup(index: number): FormGroup {
    return this.componentes.at(index) as FormGroup;
  }

  // Método para agregar un nuevo componente (formulario)
  addComponent() {
    const componenteForm = this.fb.group({
      tarea: ['', Validators.required],
      aplicaIa: ['', Validators.required],
      usadaIa: ['', Validators.required],
      calidadSalidaIa: [''],
      estimacionSinIa: [null, Validators.min(0)],
      estimacionConIa: [null, Validators.min(0)]
    });
    this.componentes.push(componenteForm);
  }

  // Método para eliminar un componente (formulario)
  removeComponent(index: number) {
    this.componentes.removeAt(index);
  }

  // Lógica para guardar o procesar los datos del formulario
  onSubmit() {
    if (this.projectForm.valid) {
      console.log('Datos del formulario:', this.projectForm.value);
      alert('Datos guardados correctamente');
      this.resetForm();
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  // Método para resetear el formulario
  resetForm() {
    this.projectForm.reset();
    this.componentes.clear(); // Limpiar componentes dinámicos
  }
}