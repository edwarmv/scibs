import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackBarService } from '@ui/snack-bar/snack-bar.service';
import { catchError, Observable, Subject, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComprobanteSalidas } from '../models/comprobante-salidas.model';

export type CreateComprobanteSalidasDto = {
  documento: string;
  fechaSalida: string;
  solicitante: {
    id: number;
  };
  gestion: {
    id: number;
  };
  salidas: {
    material: { id: number };
    cantidad: number;
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class ComprobantesSalidasService {
  private totalSubject = new Subject<number>();
  total$ = this.totalSubject.asObservable();

  apiEndpoint = `${environment.apiEndpoint}/comprobantes-salidas`;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  findAll(params: {
    skip: number;
    take: number;
    term?: string;
    gestionId?: string;
  }): Observable<{ values: ComprobanteSalidas[]; total: number }> {
    return this.http
      .get<{ values: ComprobanteSalidas[]; total: number }>(this.apiEndpoint, {
        params,
      })
      .pipe(tap(({ total }) => this.totalSubject.next(total)));
  }

  findOne(idComprobanteSalida: number): Observable<ComprobanteSalidas> {
    return this.http.get<ComprobanteSalidas>(
      `${this.apiEndpoint}/${idComprobanteSalida}`
    );
  }

  create(body: CreateComprobanteSalidasDto): Observable<ComprobanteSalidas> {
    return this.http.post<ComprobanteSalidas>(this.apiEndpoint, body).pipe(
      take(1),
      tap(() => {
        this.snackBarService.open({
          message: 'Registrado correctamente',
          duration: 3000,
        });
      }),
      catchError((error) => {
        if (error.status === 409) {
          this.snackBarService.open({
            message: error.error.message,
            style: 'error',
            duration: 3000,
          });
        }
        return throwError(() => new Error(error));
      })
    );
  }

  update(
    id: number,
    body: CreateComprobanteSalidasDto
  ): Observable<ComprobanteSalidas> {
    return this.http
      .put<ComprobanteSalidas>(`${this.apiEndpoint}/${id}`, body)
      .pipe(
        take(1),
        catchError((error) => {
          if (error.status === 409) {
            this.snackBarService.open({
              message: error.error.message,
              style: 'error',
              duration: 3000,
            });
          }
          return throwError(() => new Error(error));
        })
      );
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiEndpoint}/${id}`).pipe(
      take(1),
      tap(() => {
        this.snackBarService.open({
          message: 'Eliminado correctamente',
          style: 'warning',
          duration: 3000,
        });
      }),
      catchError((error) => {
        if (error.status === 409) {
          this.snackBarService.open({
            message: error.error.message,
            style: 'error',
            duration: 3000,
          });
        }
        return throwError(() => new Error(error));
      })
    );
  }
}
