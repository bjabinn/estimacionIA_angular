import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Proyectos } from '@models/proyectos';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Sprint } from '@models/sprint';
import { HistoriaJira } from '@models/historiaJira';
import { environment } from '@environments/environment';
import { Prompt } from '@core/models/prompt';
import { EstimacionIA } from '@core/models/estimacionIA';

@Injectable({
  providedIn: 'root',
})
export class DataGeneralService {
  private backUrl = environment.urlBack;

  constructor(private http: HttpClient) {}

  getProyectos(): Observable<Proyectos[]> {
    return this.http.get<Proyectos[]>(`${this.backUrl}/proyectos`);
  }
  getSprints(id: number): Observable<Sprint[]> {
    return this.http.get<Sprint[]>(`${this.backUrl}/proyectos/${id}/sprints`);
  }
  getHistoriaJira(id: number): Observable<HistoriaJira[]> {
    return this.http.get<HistoriaJira[]>(
      `${this.backUrl}/sprints/${id}/tareas`
    );
  }
  //Componentes
  getPromt(): Observable<Prompt[]> {
    return this.http.get<Prompt[]>(`${this.backUrl}/prompts`);
  }

  guardarDatosIA(params: EstimacionIA): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.backUrl, params, { headers });
  }
}
