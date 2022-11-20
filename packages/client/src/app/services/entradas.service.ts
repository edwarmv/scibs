import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Entrada } from '../models/entrada.model';

@Injectable({
  providedIn: 'root',
})
export class EntradasService {
  private totalSubject = new Subject<number>();
  total$ = this.totalSubject.asObservable();

  apiEndpoint = `${environment.apiEndpoint}/entradas`;
  constructor(private http: HttpClient) {}

  findAll(params: {
    skip: number;
    take: number;
    term?: string;
    gestionId?: string;
    materialId?: string;
    saldoInicial?: boolean;
  }): Observable<{ values: Entrada[]; total: number }> {
    return this.http
      .get<{ values: Entrada[]; total: number }>(this.apiEndpoint, { params })
      .pipe(tap(({ total }) => this.totalSubject.next(total)));
  }
}
