import { HistoriaJira } from '@models/historiaJira';
import { Proyectos } from '@models/proyectos';
import { Sprint } from '@models/sprint';

export const MOCK_PROYECTOS: Proyectos[] = [
  {
    id: 0,
    nombre: 'Proyecto 0',
  },
  {
    id: 1,
    nombre: 'Proyecto 1',
  },
  {
    id: 2,
    nombre: 'Proyecto 2',
  },
];

export const MOCK_SPRINTS: Sprint[] = [
  {
    id: 0,
    nombre: 'Sprint 0',
    proyectoId: 0,
  },
  {
    id: 1,
    nombre: 'Sprint 1',
    proyectoId: 1,
  },
  {
    id: 2,
    nombre: 'Sprint 2',
    proyectoId: 2,
  },
];

export const MOCK_HISTORIAS_JIRA: HistoriaJira[] = [
  {
    id: 0,
    descripcion: 'Historia 1',
  },
  {
    id: 1,
    descripcion: 'Historia 1',
  },
  {
    id: 2,
    descripcion: 'Historia 2',
  },
];
