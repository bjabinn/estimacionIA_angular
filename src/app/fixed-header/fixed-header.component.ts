import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, max } from 'rxjs/operators';
import { DynamicContentComponent } from '../dynamic-content/dynamic-content.component';
//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';
//Modals
import { Proyectos } from '@models/proyectos';
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
  ALPHANUM_REGEX,
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
  sprints: Sprint[] = [];
  historiasJira: HistoriaJira[] = [];
  proyectosFiltered: Observable<Proyectos[]> = new Observable<Proyectos[]>();
  sprintFiltered: Observable<Sprint[]> = new Observable<Sprint[]>();
  historiaJiraFiltered: Observable<HistoriaJira[]> = new Observable<
    HistoriaJira[]
  >();
  //selectedProyect = '';
  //selectedSprint = '';
  //selectedHistoriaJira = '';
  proyectoProcess = COMBO_STATUS.STANDBY;
  sprintProcess = COMBO_STATUS.STANDBY;
  historiaJiraProcess = COMBO_STATUS.STANDBY;
  msgErrorRequired = DEF_REQUIRED_ERROR;
  msgErrorPattern = DEF_PATTERN_ERROR;
  patronAlfaNum = ALPHANUM_REGEX;
  hayComplementos: boolean = false;
  promptCounter:number = 0;

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
    this.addComponent();   
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
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
        ]
      ],
      notas: ['', [Validators.maxLength(255), customPatternValidator]],
      componentes: this.formBuilder.array([]), // FormArray para manejar componentes dinámicos
    });

    this.projectForm.get('proyecto')?.disable();
    this.projectForm.get('sprint')?.disable();
    this.projectForm.get('historiaJira')?.disable();
  }

  getData() {
    this.proyectoProcess = COMBO_STATUS.LOADING;
    this.dataGeneralService.getProyectos().subscribe({
      next: (data: Proyectos[]) => {
        this.proyectoProcess = COMBO_STATUS.SUCCESS;
        this.proyectos = data;
        this.projectForm.get('proyecto')?.enable();
        this.setFilters('proyecto');
      },
      error: (error: any) => {
        if (DEV_MODE) {
          console.error(`${DEFAULT_ERROR_MAIN} los proyectos \n Error:`, error);
          this.proyectoProcess = COMBO_STATUS.SUCCESS;
          this.projectForm.get('proyecto')?.enable();
          this.proyectos = MOCK_PROYECTOS;
          this.setFilters('proyecto');
        } else {
          console.error(`${DEFAULT_ERROR_MAIN} los proyectos \n Error:`, error);
          this.proyectoProcess = COMBO_STATUS.ERROR;
          this.projectForm.get('proyecto')?.disable();
        }
      },
    });
  }

  // Método  para setear el contenido de los combos segun contenido
  setFilters(type: string) {
    const objFiltered = this.projectForm.get(type)!.valueChanges.pipe(
      startWith(''),
      map((value: any) => this.filterOptions(value, type))
    );
    if (type === 'proyecto') {
      this.proyectosFiltered = objFiltered;
    }
    if (type === 'sprint') {
      this.sprintFiltered = objFiltered;
    }
    if (type === 'historiaJira') {
      this.historiaJiraFiltered = objFiltered;
    }
    console.log('filt:', objFiltered);
  }

  // Método para obtener un FormGroup específico del FormArray
  getComponenteFormGroup(index: number): FormGroup {
    return this.componentes.at(index) as FormGroup;
  }
  
  // Método para agregar un nuevo componente (formulario)
  addComponent() {
    const componenteForm = this.formBuilder.group({
      prompt: ['', Validators.required],
      aplicaIa: ['', Validators.required],
      usadaIa: ['', Validators.required],
      calidadSalidaIa: ['',[Validators.min(0),Validators.max(10)]],
      estimacionSinIa: [null, Validators.min(0)],
      estimacionConIa: [null, Validators.min(0)],
    });
    this.componentes.push(componenteForm);
    this.promptCounter += 1;  
    this.havePrompts();
  }

  //Calcula si hay complementos según el contador
  havePrompts(){
     if (this.promptCounter > 0) {
       this.hayComplementos = true;
     }else{
       this.hayComplementos = false;
     }
     return this.hayComplementos;
   }

  // Método  para realizar acciones tras seleccionar un valor
  onSelectionProyectoChange(event: any) {
    this.sprintProcess = COMBO_STATUS.LOADING;
    this.dataGeneralService.getSprints(event.option.value.id).subscribe({
      next: (data: Sprint[]) => {
        this.sprintProcess = COMBO_STATUS.SUCCESS;
        this.sprints = data;
        this.setFilters('sprint');
        this.projectForm.get('sprint')?.enable();
      },
      error: (error: any) => {
        if (DEV_MODE) {
          this.sprintProcess = COMBO_STATUS.SUCCESS;
          console.error(`${DEFAULT_ERROR_MAIN} los sprints \n Error: `, error);
          this.sprints = MOCK_SPRINTS;
          this.setFilters('sprint');
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
    this.dataGeneralService.getHistoriaJira(event.option.value.id).subscribe({
      next: (data: HistoriaJira[]) => {
        this.historiaJiraProcess = COMBO_STATUS.SUCCESS;
        this.historiasJira = data;
        this.setFilters('historiaJira');
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
          this.setFilters('historiaJira');
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

  // Método  para devolver el placeholder de los combos según estado
  returnPlaceholder(normal: string, error: string) {
    let status = '';
    if (normal === 'un proyecto *') status = this.proyectoProcess;
    if (normal === 'un sprint *') status = this.sprintProcess;
    if (normal === 'un código de Jira *') status = this.historiaJiraProcess;
    return status === 'error'
      ? `Error adquiriendo ${error}`
      : `Selecciona ${normal}`;
  }

  // Método para eliminar un componente (formulario)
  removeComponent(index: number) {
    if (this.componentes.length > 1) {
      this.componentes.removeAt(index);
    }else{
      alert('Debe haber minimo 1 complemento');
    }
    // this.promptCounter -= 1;
    // this.havePrompts();
  }

  // Lógica para guardar o procesar los datos del formulario
  onSubmit() {    
    console.log('Datos del formulario RAW:', this.projectForm.value);
    if (this.projectForm.value) {
      const formContent = this.projectForm.value;      
      const guardarIA: EstimacionIA = {
        proyectoId: formContent.proyecto?.id,
        sprintId: formContent.sprint?.id,
        tareaId: formContent.historiaJira?.id,
        owner: formContent.owner,
        notas: formContent.notas,
        medicionesPorPrompt: this.getComponentes(),
      };
      
      console.log('Datos del formulario:', guardarIA);

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      console.log(guardarIA.medicionesPorPrompt.length);
      if (
          guardarIA.proyectoId != undefined &&
          guardarIA.sprintId != undefined &&
          guardarIA.tareaId != undefined && 
          guardarIA.owner != "" &&
          emailPattern.test(guardarIA.owner) &&
          guardarIA.medicionesPorPrompt.length > 0
        ) {
        // console.log(guardarIA);
        // console.log(guardarIA.medicionesPorPrompt[0].promptId);
        
        this.dataGeneralService.guardarDatosIA(guardarIA).subscribe({
          next: (resp: any) => {
            alert('[Main] Se ha guardado correctamente');
            console.log('[Main] Se ha guardado correctamente', resp);
            this.resetForm();
            this.addComponent();
          },
          error: (error: any) => {
            const errorMsg = ERROR_SAVE_MSG;
            console.log(errorMsg, error);
            alert(`${errorMsg} \n ${JSON.stringify(error)}`);
          },
        });
      }else{
        alert('Antes de guardar debes rellenar los campos obligatorios');
      }
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  // Método  para obtener los componentes
  getComponentes(): MedicionesPorPrompt[] {
    const componentes = this.projectForm.value.componentes;
    let formatComponentes: any[] = [];
    componentes.forEach((comp: any) => {
      if (comp.prompt?.id !== '' && comp.aplicaIa !== '' && comp.usadaIa !== '') {
        const valores = {
          promptId: comp.prompt?.id,
          aplicaIa: comp.aplicaIa,
          usadaIa: comp.usadaIa,
          calidadSalidaIa: comp.calidadSalidaIa,
          estimacionSinIa: comp.estimacionSinIa,
          estimacionConIa: comp.estimacionConIa,
        };
        formatComponentes.push(valores);
      }
      
    });
    return formatComponentes;
    
  }

  callHandleError(input: string, error: string, formG: FormGroup) {
    return this.formControlsService.hasFormError(input, error, formG);
  }

  // Funciones Autocomplete

  // Método  para filtrar el contenido de los combos
  private filterOptions(input: string, type: string): any[] {
    
    const filteredValue = input && this.patronAlfaNum.test(input)
      ? input.toLowerCase(): input;
    let resp: any[] = [];
    if (type === 'proyecto')
      resp = this.proyectos.filter(option =>
        option.nombre.toLowerCase().includes(filteredValue)
      );
    if (type === 'sprint')
      resp = this.sprints.filter(option =>
        option.nombre.toLowerCase().includes(filteredValue)
      );
    if (type === 'historiaJira')
      resp = this.historiasJira.filter(option =>
        option.descripcion.toLowerCase().includes(filteredValue)
      );
    
    return resp;
  }

  // Método  para ajustar el contenido del Input cuando se selecciona
  displayTxt(autoValue: any): string {
    //console.log(autoValue);
    return autoValue
      ? autoValue.nombre
        ? autoValue.nombre
        : autoValue.descripcion
      : '';
  }

  // Método para resetear el formulario
  resetForm() {
    this.projectForm.reset();
    this.componentes.clear(); // Limpiar componentes dinámicos
    this.projectForm.get('sprint')?.disable();
    this.projectForm.get('historiaJira')?.disable();
    sessionStorage.setItem('promptCombo', '');
    this.getData(); //Vuelve a solicitar los datos de la BBDD
  }

}
