import { Pipe, PipeTransform } from '@angular/core';
import { format } from 'date-fns';
import { Gestion } from '../models/gestion.model';

@Pipe({
  name: 'gestion',
})
export class GestionPipe implements PipeTransform {
  transform({ fechaApertura, fechaCierre }: Gestion): string {
    const apertura = new Date(fechaApertura);
    const cierre = fechaCierre ? new Date(fechaCierre) : null;
    return `${format(apertura, 'Y')} - ${format(apertura, 'd/MM/yyyy')}${
      cierre ? ' - ' + format(cierre, 'd/MM/yyyy') : ''
    }`;
  }
}
