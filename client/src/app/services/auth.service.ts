import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SnackBarService } from '@ui/snack-bar/snack-bar.service';
import { catchError, take, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import jwt_decode from 'jwt-decode';

type TokenPayload = { iat: number; sub: number; username: string };

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiEndpoint = `${environment.apiEndpoint}/auth`;

  constructor(
    private http: HttpClient,
    private snackbarService: SnackBarService,
    private router: Router
  ) {}

  login(username: string, password: string) {
    return this.http
      .post<{ access_token: string }>(`${this.apiEndpoint}/login`, {
        username,
        password,
      })
      .pipe(
        take(1),
        tap(({ access_token }) => {
          localStorage.setItem('access_token', access_token);
          this.router.navigate(['/entradas']);
        }),
        catchError((error) => {
          if (error.status === 401) {
            this.snackbarService.open({
              message: 'Usuario o contraseña incorrectos.',
              style: 'error',
            });
          }
          return throwError(() => new Error(error));
        })
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  isAuthenticated() {
    const token = localStorage.getItem('access_token');

    return !!token;
  }

  get token(): string | null {
    return localStorage.getItem('access_token');
  }

  get tokenPayload(): TokenPayload | null {
    const token = localStorage.getItem('access_token');
    if (token) {
      return jwt_decode<TokenPayload>(token);
    } else {
      return null;
    }
  }
}
