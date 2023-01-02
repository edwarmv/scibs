import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { delay, map, Observable, switchMap, take } from 'rxjs';
import { StockMaterialesService } from '../services/stock-materiales.service';
import { of } from 'rxjs';

type Salida = {
  id: number;
  material: { id: number; nombre: string; prevNombre: string };
  cantidad: number;
  cantidadRegistrada: number;
};

export function StockMaterialValidator(
  stockMaterialesService: StockMaterialesService,
  gestionId$: Observable<number | null>
): AsyncValidatorFn {
  return (
    control: AbstractControl<Salida>
  ): Observable<ValidationErrors | null> => {
    const idMaterial = control.get('material')?.get('id')?.value;
    const cantidad = control.get('cantidad')?.value;
    const cantidadRegistrada = control.get('cantidadRegistrada')?.value || 0;
    return gestionId$.pipe(
      take(1),
      switchMap((idGestion) => {
        if (idMaterial && cantidad && idGestion) {
          return stockMaterialesService
            .getStockMaterial(1, { idGestion: 2 })
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
      })
    );
  };
}
