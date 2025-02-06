import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

//Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSelectModule } from '@angular/material/select';

import { ChangeService } from "src/app/change.service";
import { DataGeneralService } from '@services/dataGeneral.service';
import { Proyectos } from '@app/core/models/proyectos';

@Component({
  selector: 'app-view-estimacion',
  imports: [
    CommonModule,
    AsyncPipe,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatSelectModule,
  ],
  templateUrl: './view-estimacion.component.html',
  styleUrl: './view-estimacion.component.css'
})
export class ViewEstimacionComponent implements OnInit{
  projectForm!: FormGroup;
  proyectos: Proyectos[] = [];

  constructor(
    ChangeService: ChangeService,
    private dataGeneralService: DataGeneralService,
    private fb: FormBuilder
  ){
    this.projectForm = this.fb.group({
      proyecto: ['', Validators.required]
    });
  }

  ngOnInit(){
    this.getData();
  }

  getData(){
    this.dataGeneralService.getProyectos().subscribe({
      next: (data: Proyectos[]) =>{
        this.proyectos = data;
        this.proyectos.sort((a,b) => a.nombre.localeCompare(b.nombre));
        console.log(this.proyectos);
        
      },
      error: (error) =>{
        console.error('Error al obtener Proyectos: ',error);
      }
      
    })
  }

  obtainProyectoId(event: any){
    const projectId = event.option.value.id;
    console.log(projectId);
    
  }
}
