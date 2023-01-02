import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackBarService } from '@ui/snack-bar/snack-bar.service';
import { catchError, Observable, Subject, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ComprobanteEntradas } from '../models/comprobante-entradas.model';

export type CreateComprobanteEntradasDto = {
  documento: string;
  fechaEntrada: string;
  saldoInicial: boolean;
  saldoGestionAnterior: boolean;
  proveedor: {
    id: number;
  };
  gestion: {
    id: number;
  };
  entradas: {
    material: { id: number };
    precioUnitario: number;
    cantidad: number;
  }[];
};

@Injectable({
  providedIn: 'root',
})
export class ComprobantesEntradasService {
  private totalSubject = new Subject<number>();
  total$ = this.totalSubject.asObservable();

  apiEndpoint = `${environment.apiEndpoint}/comprobantes-entradas`;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  findAll(params: {
    skip: number;
    take: number;
    term?: string;
    saldoInicial?: boolean;
    saldoGestionAnterior?: boolean;
    gestionId?: string;
  }): Observable<{ values: ComprobanteEntradas[]; total: number }> {
    return this.http
      .get<{ values: ComprobanteEntradas[]; total: number }>(this.apiEndpoint, {
        params,
      })
      .pipe(tap(({ total }) => this.totalSubject.next(total)));
  }

  findOne(idComprobanteEntradas: number): Observable<ComprobanteEntradas> {
    return this.http.get<ComprobanteEntradas>(
      `${this.apiEndpoint}/${idComprobanteEntradas}`
    );
  }

  create(body: CreateComprobanteEntradasDto): Observable<ComprobanteEntradas> {
    return this.http.post<ComprobanteEntradas>(this.apiEndpoint, body).pipe(
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
    body: CreateComprobanteEntradasDto
  ): Observable<ComprobanteEntradas> {
    return this.http
      .put<ComprobanteEntradas>(`${this.apiEndpoint}/${id}`, body)
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

  cargarSaldosGestionAnterior(body: {
    from: { id: number };
    to: { id: number };
    fechaEntrada: string;
  }): Observable<void> {
    return this.http
      .post<void>(`${this.apiEndpoint}/cargar-saldos-gestion-anterior`, body)
      .pipe(
        take(1),
        tap(() => {
          this.snackBarService.open({
            message: 'Saldos cargados correctamente',
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
