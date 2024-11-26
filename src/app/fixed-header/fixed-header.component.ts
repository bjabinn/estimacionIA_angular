import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { DynamicContentComponent } from '../dynamic-content/dynamic-content.component';
//Modules
import { Proyectos } from '../share/models/proyectos';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { Sprint } from '../share/models/sprint';
import { HistoriaJira } from '../share/models/historiaJira';
import { DataGeneralService } from '../share/services/dataGeneral.service';
import { DEFAULT_ERROR_MAIN } from '../share/constants/general.const';
import {
  MOCK_HISTORIAS_JIRA,
  MOCK_PROYECTOS,
  MOCK_SPRINTS,
} from '../share/constants/mock-general';

@Component({
  selector: 'app-fixed-header',
  templateUrl: './fixed-header.component.html',
  styleUrls: ['./fixed-header.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    DynamicContentComponent,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class FixedHeaderComponent implements OnInit {
  projectForm!: FormGroup;
  proyectos: Proyectos[] = [];
  selectedProyect: any;
  sprints: Sprint[] = [];
  historiasJira: HistoriaJira[] = [];

  // Obtener el FormArray de componentes y asegurar que los controles son de tipo FormGroup
  get componentes(): FormArray {
    return this.projectForm.get('componentes') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.getData();
  }

  // Crear el formulario reactivo con validadores básicos
  createForm() {
    this.projectForm = this.formBuilder.group({
      proyecto: ['', Validators.required],
      sprint: ['', Validators.required],
      historiaJira: ['', Validators.required],
      owner: ['', Validators.required],
      notas: [''],
      componentes: this.formBuilder.array([]), // FormArray para manejar componentes dinámicos
    });
  }

  getData() {
    this.dataGeneralService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectos = data;
      },
      error: (error: any) => {
        console.error(`${DEFAULT_ERROR_MAIN} los proyectos \n Error: ${error}`);
        this.proyectos = MOCK_PROYECTOS;
      },
    });
    this.dataGeneralService.getSprints().subscribe({
      next: (data: Sprint[]) => {
        this.sprints = data;
      },
      error: (error: any) => {
        console.error(`${DEFAULT_ERROR_MAIN} los sprints \n Error: ${error}`);
        this.sprints = MOCK_SPRINTS;
      },
    });
    this.dataGeneralService.getHistoriaJira().subscribe({
      next: (data: HistoriaJira[]) => {
        this.historiasJira = data;
      },
      error: (error: any) => {
        console.error(`${DEFAULT_ERROR_MAIN} los proyectos \n Error: ${error}`);
        this.historiasJira = MOCK_HISTORIAS_JIRA;
      },
    });
  }

  // Método para obtener un FormGroup específico del FormArray
  getComponenteFormGroup(index: number): FormGroup {
    return this.componentes.at(index) as FormGroup;
  }

  // Método para agregar un nuevo componente (formulario)
  addComponent() {
    const componenteForm = this.formBuilder.group({
      tarea: ['', Validators.required],
      aplicaIa: ['', Validators.required],
      usadaIa: ['', Validators.required],
      calidadSalidaIa: [''],
      estimacionSinIa: [null, Validators.min(0)],
      estimacionConIa: [null, Validators.min(0)],
    });
    this.componentes.push(componenteForm);
  }

  onSelectionProyectoChange(event: any) {}

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
