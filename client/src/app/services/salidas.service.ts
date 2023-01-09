import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Salida } from '../models/salida.model';

@Injectable({
  providedIn: 'root',
})
export class SalidasService {
  private totalSubject = new Subject<number>();
  total$ = this.totalSubject.asObservable();

  apiEndpoint = `${environment.apiEndpoint}/salidas`;
  constructor(private http: HttpClient) {}

  findAll(params: {
    skip: number;
    take: number;
    term?: string;
    solicitanteId?: string;
    gestionId?: string;
    materialId?: string;
    vencido?: boolean;
  }): Observable<{ values: Salida[]; total: number }> {
    return this.http
      .get<{ values: Salida[]; total: number }>(this.apiEndpoint, { params })
      .pipe(tap(({ total }) => this.totalSubject.next(total)));
  }
}
