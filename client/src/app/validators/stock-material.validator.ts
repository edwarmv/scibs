import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { delay, map, Observable } from 'rxjs';
import { StockMaterialesService } from '../services/stock-materiales.service';
import { of } from 'rxjs';

type Salida = {
  id: number;
  material: { id: number; nombre: string; prevNombre: string };
  cantidad: number;
  cantidadRegistrada: number;
  gestionId: number | null;
};

export function StockMaterialValidator(
  stockMaterialesService: StockMaterialesService
): AsyncValidatorFn {
  return (
    control: AbstractControl<Salida>
  ): Observable<ValidationErrors | null> => {
    const materialId = control.get('material')?.get('id')?.value;
    const gestionId = control.get('gestionId')?.value;
    const cantidad = control.get('cantidad')?.value;
    const cantidadRegistrada = control.get('cantidadRegistrada')?.value || 0;
    if (materialId && cantidad && gestionId) {
      return stockMaterialesService
        .getStockMaterial(materialId, { idGestion: gestionId })
        .pipe(
          delay(1000),
          map((stock) => {
            if (stock >= Number(cantidad) - cantidadRegistrada) {
              return null;
            } else {
              return {
                materialStock: { stock: stock + cantidadRegistrada },
              };
            }
          })
        );
    } else {
      return of(null);
    }
  };
}
