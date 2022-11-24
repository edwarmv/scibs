import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StockMaterialesService {
  apiEndpoint = `${environment.apiEndpoint}/stock-materiales`;

  constructor(private http: HttpClient) {}

  getStockMaterial(idMaterial: number): Observable<number> {
    return this.http
      .get<{ stock: number }>(`${this.apiEndpoint}/${idMaterial}`)
      .pipe(map(({ stock }) => stock));
  }
}
