import { format } from 'date-fns';
import { Gestion } from '../models/gestion.model';

export function getGestionLabel(gestion: Gestion): string {
  return `${format(new Date(gestion.fechaApertura), 'yyyy')} - ${format(
    new Date(gestion.fechaApertura),
    'd/MM/yyyy'
  )}${
    gestion.fechaCierre
      ? ' - ' + format(new Date(gestion.fechaCierre), 'd/MM/yyyy')
      : ''
  }`;
}
