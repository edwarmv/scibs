import { Pipe, PipeTransform } from '@angular/core';
import { ComprobanteEntradas } from '../models/comprobante-entradas.model';

@Pipe({
  name: 'documentoComprobateEntrada',
})
export class DocumentoComprobateEntradaPipe implements PipeTransform {
  transform(comprobanteEntradas: ComprobanteEntradas): string {
    return comprobanteEntradas.saldoInicial ||
      comprobanteEntradas.saldoGestionAnterior
      ? '000-' + comprobanteEntradas.id
      : comprobanteEntradas.documento;
  }
}
