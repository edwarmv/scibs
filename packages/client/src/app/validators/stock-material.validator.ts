import {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { debounceTime, delay, map, Observable, takeUntil } from 'rxjs';
import { StockMaterialesService } from '../services/stock-materiales.service';
import { of } from 'rxjs';

type Salida = {
  id: number;
  material: { id: number; nombre: string; prevNombre: string };
  cantidad: number;
};

export function StockMaterialValidator(
  stockMaterialesService: StockMaterialesService
): AsyncValidatorFn {
  return (
    control: AbstractControl<Salida>
  ): Observable<ValidationErrors | null> => {
    const idMaterial = control.get('material')?.get('id')?.value;
    const cantidad = control.get('cantidad')?.value;
    if (idMaterial && cantidad) {
      return stockMaterialesService.getStockMaterial(idMaterial).pipe(
        delay(1000),
        map((stock) => {
          if (stock >= Number(cantidad)) {
            return null;
          } else {
            return { materialStock: { stock } };
          }
        })
      );
    } else {
      return of(null);
    }
  };
}
