import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockMaterial } from '../models/stock-material.model';

@Injectable({
  providedIn: 'root',
})
export class StockMaterialesService {
  apiEndpoint = `${environment.apiEndpoint}/stock-materiales`;

  constructor(private http: HttpClient) {}

  findAll(params: {
    skip: number;
    take: number;
    term?: string;
    idGestion?: string;
    idMaterial?: string;
    saldosNulos?: boolean;
    conSaldo?: boolean;
    saldosIniciales?: boolean;
    saldosGestionAnterior?: boolean;
  }): Observable<{ values: StockMaterial[]; total: number }> {
    return this.http.get<{ values: StockMaterial[]; total: number }>(
      this.apiEndpoint,
      { params }
    );
  }

  getStockMaterial(
    idMaterial: number,
    params: { idGestion: number }
  ): Observable<number> {
    return this.http
      .get<{ stock: number }>(`${this.apiEndpoint}/${idMaterial}`, { params })
      .pipe(map(({ stock }) => stock));
  }
}
