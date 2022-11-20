import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackBarService } from '@ui/snack-bar/snack-bar.service';
import { catchError, Observable, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gestion } from '../models/gestion.model';

@Injectable({
  providedIn: 'root'
})
export class GestionesService {
  apiEndpoint = `${environment.apiEndpoint}/gestiones`;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService
  ) {}

  findAll(params: {
    skip: number;
    take: number;
    term?: string;
    partidaId?: number;
  }): Observable<{ values: Gestion[]; total: number }> {
    return this.http
      .get<{ values: Gestion[]; total: number }>(this.apiEndpoint, {
        params: params,
      });
  }

  create(body: {
    fechaApertura: string;
  }): Observable<Gestion> {
    return this.http.post<Gestion>(this.apiEndpoint, body).pipe(
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
    body: {
      fechaApertura: string;
      fechaCierre: string;
    }
  ): Observable<Gestion> {
    return this.http.put<Gestion>(`${this.apiEndpoint}/${id}`, body).pipe(
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
