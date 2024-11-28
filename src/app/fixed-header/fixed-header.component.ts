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
import { Proyectos } from '@models/proyectos';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
import { Sprint } from '@models/sprint';
import { HistoriaJira } from '@models/historiaJira';
import { DataGeneralService } from '@services/dataGeneral.service';
import {
  COMBO_STATUS,
  DEF_PATTERN_ERROR,
  DEF_REQUIRED_ERROR,
  DEFAULT_ERROR_MAIN,
  DEV_MODE,
  ERROR_SAVE_MSG,
  VALID_CHARACTERS_REGEX,
} from '@constants/general.const';
import {
  MOCK_HISTORIAS_JIRA,
  MOCK_PROYECTOS,
  MOCK_SPRINTS,
} from '@constants/mock-general';
import { EstimacionIA } from '@models/estimacionIA';
import { MedicionesPorPrompt } from '@models/medicionesPorPrompt';
import { FormControlsService } from '@services/formControls.service';
import { customPatternValidator } from '@validators/custom-pattern.validator';

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
  selectedProyect = '';
  selectedSprint = '';
  selectedHistoriaJira = '';
  sprints: Sprint[] = [];
  historiasJira: HistoriaJira[] = [];
  proyectoProcess = COMBO_STATUS.STANDBY;
  sprintProcess = COMBO_STATUS.STANDBY;
  historiaJiraProcess = COMBO_STATUS.STANDBY;
  msgErrorRequired = DEF_REQUIRED_ERROR;
  msgErrorPattern = DEF_PATTERN_ERROR;

  // Obtener el FormArray de componentes y asegurar que los controles son de tipo FormGroup
  get componentes(): FormArray {
    return this.projectForm.get('componentes') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private dataGeneralService: DataGeneralService,
    private formControlsService: FormControlsService
  ) {
    sessionStorage.clear();
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
      owner: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          customPatternValidator,
        ],
      ],
      notas: ['', [Validators.maxLength(255), customPatternValidator]],
      componentes: this.formBuilder.array([]), // FormArray para manejar componentes dinámicos
    });

    this.projectForm.get('proyecto')?.disable();
    this.projectForm.get('sprint')?.disable();
    this.projectForm.get('historiaJira')?.disable();
  }

  getData() {
    this.proyectoProcess = COMBO_STATUS.STANDBY;
    this.dataGeneralService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectoProcess = COMBO_STATUS.SUCCESS;
        this.proyectos = data;
        this.projectForm.get('proyecto')?.enable();
      },
      error: (error: any) => {
        if (DEV_MODE) {
          console.error(`${DEFAULT_ERROR_MAIN} los proyectos \n Error:`, error);
          this.proyectoProcess = COMBO_STATUS.SUCCESS;
          this.projectForm.get('proyecto')?.enable();
          this.proyectos = MOCK_PROYECTOS;
        } else {
          console.error(`${DEFAULT_ERROR_MAIN} los proyectos \n Error:`, error);
          this.proyectoProcess = COMBO_STATUS.ERROR;
          this.projectForm.get('proyecto')?.disable();
        }
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

  onSelectionProyectoChange(event: any) {
    console.log('PROJ: ', event);
    this.sprintProcess = COMBO_STATUS.LOADING;
    this.dataGeneralService.getSprints(event.value.id).subscribe({
      next: (data: Sprint[]) => {
        this.sprintProcess = COMBO_STATUS.SUCCESS;
        this.sprints = data;
        this.projectForm.get('sprint')?.enable();
      },
      error: (error: any) => {
        if (DEV_MODE) {
          this.sprintProcess = COMBO_STATUS.SUCCESS;
          console.error(`${DEFAULT_ERROR_MAIN} los sprints \n Error: `, error);
          this.sprints = MOCK_SPRINTS;
          this.projectForm.get('sprint')?.enable();
        } else {
          this.sprintProcess = COMBO_STATUS.ERROR;
          console.error(`${DEFAULT_ERROR_MAIN} los sprints \n Error: `, error);
          this.projectForm.get('sprint')?.disable();
        }
      },
    });
  }

  onSelectionSprintsChange(event: any) {
    this.historiaJiraProcess = COMBO_STATUS.LOADING;
    this.dataGeneralService.getHistoriaJira(event.value.id).subscribe({
      next: (data: HistoriaJira[]) => {
        this.historiaJiraProcess = COMBO_STATUS.SUCCESS;
        this.historiasJira = data;
        this.projectForm.get('historiaJira')?.enable();
      },
      error: (error: any) => {
        if (DEV_MODE) {
          this.historiaJiraProcess = COMBO_STATUS.SUCCESS;
          console.error(
            `${DEFAULT_ERROR_MAIN} las historias de Jira \n Error: `,
            error
          );
          this.historiasJira = MOCK_HISTORIAS_JIRA;
          this.projectForm.get('historiaJira')?.enable();
        } else {
          this.historiaJiraProcess = COMBO_STATUS.ERROR;
          console.error(
            `${DEFAULT_ERROR_MAIN} las historias de Jira \n Error: `,
            error
          );
          this.projectForm.get('historiaJira')?.disable();
        }
      },
    });
  }

  onSelectionHistoriaJiraChange(event: any) {}

  returnPlaceholder(normal: string, error: string) {
    let status = '';
    if (normal === 'un proyecto') status = this.proyectoProcess;
    if (normal === 'un sprint') status = this.sprintProcess;
    if (normal === 'un código de Jira') status = this.historiaJiraProcess;

    return status === 'error'
      ? `Error adquiriendo ${error}`
      : `Selecciona ${normal}`;
  }

  // Método para eliminar un componente (formulario)
  removeComponent(index: number) {
    this.componentes.removeAt(index);
  }

  // Lógica para guardar o procesar los datos del formulario
  onSubmit() {
    console.log('Datos del formulario RAW:', this.projectForm.value);
    if (this.projectForm.valid) {
      const formContent = this.projectForm.value;
      console.log('Datos del formulario:', formContent);
      const guardarIA: EstimacionIA = {
        proyectoId: formContent.proyecto?.id,
        sprintId: formContent.sprint?.id,
        tareaId: formContent.historiaJira?.id,
        owner: formContent.owner,
        notas: formContent.notas,
        medicionesPorPrompt: this.getComponentes(),
      };
      this.dataGeneralService.guardarDatosIA(guardarIA).subscribe({
        next: (resp: any) => {
          console.log('[Main] Se ha guardado correctamente', resp);
          this.resetForm();
        },
        error: (error: any) => {
          const errorMsg = ERROR_SAVE_MSG;
          console.log(errorMsg, error);
          alert(`${errorMsg} \n ${JSON.stringify(error)}`);
        },
      });
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  getComponentes(): MedicionesPorPrompt[] {
    const componentes = this.projectForm.value.componentes;
    let formatComponentes: any[] = [];
    componentes.forEach((comp: any) => {
      const valores = {
        promptId: comp.tarea?.id,
        aplicaIa: comp.aplicaIa,
        usadaIa: comp.usadaIa,
        calidadSalidaIa: comp.calidadSalidaIa,
        estimacionSinIa: comp.estimacionSinIa,
        estimacionConIa: comp.estimacionConIa,
      };
      formatComponentes.push(valores);
    });
    return formatComponentes;
  }

  callHandleError(input: string, error: string, formG: FormGroup) {
    return this.formControlsService.hasFormError(input, error, formG);
  }

  // Método para resetear el formulario
  resetForm() {
    this.projectForm.reset();
    this.componentes.clear(); // Limpiar componentes dinámicos
    sessionStorage.setItem('promptCombo', '');
  }
}
