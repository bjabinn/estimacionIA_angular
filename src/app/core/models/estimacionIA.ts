import { MedicionesPorPrompt } from './medicionesPorPrompt';

export interface EstimacionIA {
  proyectoId: number;
  sprintId: number;
  tareaId: number;
  owner: string;
  notas?: string;
  medicionesPorPrompt: MedicionesPorPrompt[];
}
