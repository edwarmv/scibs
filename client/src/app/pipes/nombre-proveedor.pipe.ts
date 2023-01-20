import { Pipe, PipeTransform } from '@angular/core';
import { titleCase } from 'title-case';
import { ComprobanteEntradas } from '../models/comprobante-entradas.model';

@Pipe({
  name: 'nombreProveedor',
})
export class NombreProveedorPipe implements PipeTransform {
  transform(comprobanteEntradas: ComprobanteEntradas): string {
    return comprobanteEntradas.saldoGestionAnterior
      ? 'Salgo gestión anterior'
      : titleCase(comprobanteEntradas.proveedor.nombre);
  }
}
