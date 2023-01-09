import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackBarService } from '@ui/snack-bar/snack-bar.service';
import { catchError, Observable, Subject, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UnidadManejo } from '../models/unidad-manejo.model';

@Injectable({
  providedIn: 'root',
})
export class UnidadesManejoService {
  private totalSubject = new Subject<number>();
  total$ = this.totalSubject.asObservable();

  apiEndpoint = `${environment.apiEndpoint}/unidades-manejo`;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  findAll(params?: {
    skip: number;
    take: number;
    term?: string;
  }): Observable<{ values: UnidadManejo[]; total: number }> {
    return this.http
      .get<{ values: UnidadManejo[]; total: number }>(this.apiEndpoint, {
        params: params,
      })
      .pipe(tap(({ total }) => this.totalSubject.next(total)));
  }

  create(body: { nombre: string }): Observable<UnidadManejo> {
    return this.http.post<UnidadManejo>(this.apiEndpoint, body).pipe(
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

  update(id: number, body: { nombre: string }): Observable<UnidadManejo> {
    return this.http.put<UnidadManejo>(`${this.apiEndpoint}/${id}`, body).pipe(
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
