import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {
  COMBO_STATUS,
  DEF_REQUIRED_ERROR,
  DEFAULT_ERROR_MAIN,
  DEV_MODE,
} from '@core/constants/general.const';
import { MOCK_PROMT } from '@core/constants/mock-general';
import { Prompt } from '@core/models/prompt';
import { DataGeneralService } from '@core/services/dataGeneral.service';
import { FormControlsService } from '@core/services/formControls.service';
import { StorageService } from '@core/services/storage/storage.service';

@Component({
  selector: 'app-dynamic-content',
  templateUrl: './dynamic-content.component.html',
  styleUrls: ['./dynamic-content.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class DynamicContentComponent implements OnInit {
  @Input() dynamicForm: FormGroup = new FormGroup({}); // Asignar un valor inicial
  @Output() remove = new EventEmitter<void>(); // Emite un evento para eliminar el componente

  promptStatus = COMBO_STATUS.STANDBY;
  selectedPrompt!: Prompt;
  prompts: Prompt[] = [];
  msgErrorRequired = DEF_REQUIRED_ERROR;

  constructor(
    private dataGeneralService: DataGeneralService,
    private formControlsService: FormControlsService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    this.promptStatus = COMBO_STATUS.LOADING;
    this.dynamicForm.get('tarea')?.disable();

    if (sessionStorage.getItem('promptCombo')) {
      this.prompts = JSON.parse(sessionStorage.getItem('promptCombo') || '');
      this.promptStatus = COMBO_STATUS.SUCCESS;
      this.dynamicForm.get('tarea')?.enable();
    }
    console.log('complemento', this.prompts);

    if (this.prompts.length < 1) {
      this.dataGeneralService.getPromt().subscribe({
        next: (data: Prompt[]) => {
          sessionStorage.setItem('promptCombo', JSON.stringify(data));
          this.dynamicForm.get('tarea')?.enable();
          this.promptStatus = COMBO_STATUS.SUCCESS;
          this.prompts = data;
        },
        error: (error: any) => {
          if (DEV_MODE) {
            this.promptStatus = COMBO_STATUS.SUCCESS;
            console.error(`${DEFAULT_ERROR_MAIN} los prompts \n Error:`, error);
            this.prompts = MOCK_PROMT;
            this.dynamicForm.get('tarea')?.enable();
            sessionStorage.setItem('promptCombo', JSON.stringify(MOCK_PROMT));
          } else {
            this.promptStatus = COMBO_STATUS.ERROR;
            console.error(`${DEFAULT_ERROR_MAIN} los prompts \n Error:`, error);
            this.prompts = [];
            this.dynamicForm.get('tarea')?.disable();
            sessionStorage.setItem('promptCombo', '');
          }
        },
      });
    }
  }

  returnPlaceholder(normal: string, error: string) {
    return this.promptStatus === 'error'
      ? `Error adquiriendo ${error}`
      : `Selecciona ${normal}`;
  }

  onSelectionPromptChange(event: any) {}

  callHandleError(input: string, error: string, formG: FormGroup) {
    return this.formControlsService.hasFormError(input, error, formG);
  }

  // Método para emitir el evento de eliminación
  removeComponent() {
    this.remove.emit();
  }
}
