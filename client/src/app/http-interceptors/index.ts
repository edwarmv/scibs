import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Provider } from '@angular/core';
import { AuthInterceptor } from './auth.interceptor';
import { ConnectionRefusedInterceptor } from './connection-refused.interceptor';

export const httpInterceptorProviders: Provider[] = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ConnectionRefusedInterceptor, multi: true },
];
