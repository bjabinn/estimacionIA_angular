import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Proyectos } from '../models/proyectos';
import { HttpClient } from '@angular/common/http';
import { Sprint } from '../models/sprint';
import { HistoriaJira } from '../models/historiaJira';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataGeneralService {
  private backUrl = environment.urlBack;

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>(`${this.backUrl}/proyectos`);
  }
  getSprints(): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.backUrl}/sprints`);
  }
  getHistoriaJira(): Observable<HistoriaJira[]> {
    return this.http.get<HistoriaJira[]>(`${this.backUrl}/historiasJira`);
  }
}
