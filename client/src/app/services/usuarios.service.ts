import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SnackBarService } from '@ui/snack-bar/snack-bar.service';
import { catchError, Observable, of, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Usuario } from '../models/usuario.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  apiEndpoint = `${environment.apiEndpoint}/usuarios`;

  constructor(
    private http: HttpClient,
    private snackBarService: SnackBarService,
    private auhtService: AuthService
  ) {}

  crear(usuario: {
    nombre: string;
    apellido: string;
    username: string;
    password: string;
  }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiEndpoint}`, usuario).pipe(
      take(1),
      tap((resp) => {
        this.snackBarService.open({
          message: 'Usuario creado',
          duration: 2500,
        });
      }),
      catchError((error) => {
        this.snackBarService.open({
          message: error.error.message,
          duration: 3500,
          style: 'error',
        });
        return throwError(() => new Error(error));
      })
    );
  }

  profile(): Observable<Usuario | null> {
    const tokenPayload = this.auhtService.tokenPayload;
    if (tokenPayload) {
      return this.http
        .get<Usuario>(`${this.apiEndpoint}/${tokenPayload.sub}`)
        .pipe(take(1));
    } else {
      return of(null);
    }
  }

  changePassword(username: string, password: string) {
    return this.http
      .put(`${this.apiEndpoint}/change-password`, { username, password })
      .pipe(
        take(1),
        tap((resp) => {
          this.snackBarService.open({
            message: 'Contraseña cambiada',
            duration: 2500,
          });
        }),
        catchError((error) => {
          if (error.status === 409) {
            this.snackBarService.open({
              message: error.error.message,
              style: 'error',
            });
          }
          return throwError(() => new Error(error));
        })
      );
  }

  update(
    idUsuario: number,
    usuario: { nombre: string; apellido: string; username: string }
  ): Observable<Usuario> {
    return this.http
      .put<Usuario>(`${this.apiEndpoint}/${idUsuario}`, usuario)
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
}
